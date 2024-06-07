import sqlite3 from "sqlite3";
const db = new sqlite3.Database("db.sqlite");
const usersInTransaction = new Set();
function runPromise(query, ...args) {
    if (args.length > 0) {
        return new Promise((resolve, reject)=>{
            db.prepare(query).run(args, function(err) {
                if (err) reject(err);
                resolve(this);
            });
        });
    }
    return new Promise((resolve, reject)=>{
        db.run(query, function(err) {
            if (err) reject(err);
            resolve(this);
        });
    });
}
function getPromise(obj, ...args) {
    if (typeof obj === 'string') {
        obj = db.prepare(obj);
    }
    return new Promise((resolve, reject)=>{
        obj.get(args, (err, rows)=>{
            if (err) reject(err);
            resolve(rows);
        });
    });
}
function allPromise(obj, ...args) {
    if (typeof obj === 'string') {
        obj = db.prepare(obj);
    }
    return new Promise((resolve, reject)=>{
        obj.all(args, (err, rows)=>{
            if (err) reject(err);
            resolve(rows);
        });
    });
}
try {
    await runPromise(`CREATE TABLE IF NOT EXISTS users (
		id TEXT UNIQUE PRIMARY KEY,
		coins INTEGER NOT NULL DEFAULT 0,
		bottrades INTERGER NOT NULL DEFAULT 0,
		trades INTERGER NOT NULL DEFAULT 0,
		madfut_username TEXT UNIQUE,
		madfut_uid TEXT UNIQUE,
		linkchannel TEXT,
		moneymancd INTERGER NOT NULL DEFAULT 0
	);`);
} catch (err) {
    console.log("Couldn't initialize database (creating users table). Exiting");
    process.exit(1);
}
try {
    await runPromise(`CREATE TABLE IF NOT EXISTS accounts (
		email TEXT UNIQUE,
		username TEXT UNIQUE
	);`);
} catch (err1) {
    console.log("Couldn't initialize database (creating accounts table). Exiting");
    process.exit(1);
}
try {
    await runPromise(`CREATE TABLE IF NOT EXISTS code (
		codename TEXT,
		username TEXT,
		duration INTERGER NOT NULL DEFAULT 0
	);`);
} catch (err2) {
    console.log("Couldn't initialize database (creating code table). Exiting");
    process.exit(1);
}
try {
    await runPromise(`CREATE TABLE IF NOT EXISTS rewards (
		id sqlite_int64 PRIMARY KEY,
		gold TEXT NOT NULL DEFAULT '❌',
		totw TEXT NOT NULL DEFAULT '❌',
		tots TEXT NOT NULL DEFAULT '❌',
		icon TEXT NOT NULL DEFAULT '❌',
		toty TEXT NOT NULL DEFAULT '❌',
		madfut_icon TEXT NOT NULL DEFAULT '❌',
		future_icon TEXT NOT NULL DEFAULT '❌',
		boosttime INTERGER NOT NULL DEFAULT 0,
		donatortime INTERGER NOT NULL DEFAULT 0,
		dailyspintime INTERGER NOT NULL DEFAULT 0,
		madfut_username TEXT UNIQUE
	);`);
} catch (err3) {
    console.log("Couldn't initialize database (creating rewards table). Exiting");
    process.exit(1);
}
try {
    await runPromise(`CREATE TABLE IF NOT EXISTS matchstatus (
		teamstatus TEXT NOT NULL DEFAULT '❌',
		claimstatus TEXT NOT NULL DEFAULT '❌',
		votestatus TEXT NOT NULL DEFAULT '❌',
		votetime INTERGER NOT NULL DEFAULT 0,
		homestatus TEXT NOT NULL DEFAULT '❌',
		drawstatus TEXT NOT NULL DEFAULT '❌',
		awaystatus TEXT NOT NULL DEFAULT '❌',
		mincoinsbet NUMBER NOT NULL DEFAULT 0,
		maxcoinsbet NUMBER NOT NULL DEFAULT 0,
		minbottradesbet NUMBER NOT NULL DEFAULT 0,
		maxbottradesbet NUMBER NOT NULL DEFAULT 0,
		multiplier NUMBER NOT NULL DEFAULT 0
	);`);
} catch (err4) {
    console.log("Couldn't initialize database (creating matchstatus table). Exiting");
    process.exit(1);
}
try {
    await runPromise(`CREATE TABLE IF NOT EXISTS names (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		data TEXT,
		data2 TEXT,
		data3 TEXT
	);`);
} catch (err5) {
    console.log("Couldn't initialize database (creating names table). Exiting");
    process.exit(1);
}
try {
    await runPromise(`CREATE TABLE IF NOT EXISTS wallet (
		identifier TEXT NOT NULL,
		type INTEGER NOT NULL, -- 0 = card, 1 = pack
		amount INTEGER NOT NULL,
		user_id INTEGER NOT NULL,
		PRIMARY KEY("user_id","identifier","type"),
		FOREIGN KEY(user_id) REFERENCES users(id)
	);`);
} catch (err6) {
    console.log("Couldn't initialize database (creating wallet table). Exiting");
    process.exit(1);
}
try {
    await runPromise(`CREATE TRIGGER IF NOT EXISTS wallet_zero_deletion 
	AFTER UPDATE
	ON wallet
	WHEN new.amount = 0
 BEGIN
  DELETE FROM wallet WHERE identifier = new.identifier AND user_id = new.user_id AND type = new.type;
 END;`);
} catch (err7) {
    console.log("Couldn't initialize database (zero trigger). Exiting");
    process.exit(1);
}
try {
    await runPromise(`CREATE TRIGGER IF NOT EXISTS wallet_negative_check 
	BEFORE UPDATE
	ON wallet
	WHEN new.amount < 0
 BEGIN
  SELECT RAISE (ABORT,'Negative amount in wallet');
 END;`);
} catch (err8) {
    console.log("Couldn't initialize database (negative trigger). Exiting");
    process.exit(1);
}
console.log("Database initialized");
const EmptyWallet = {
    coins: 0,
    bottrades: 0,
    count: 0,
    cards: [],
    packs: []
};
function ratingToStr(minRating, maxRating) {
    try {
        return minRating + (maxRating >= 100 ? "+" : "-" + maxRating);
    } catch  {
        return "";
    }
}
function newProbabilityToStr(newProb) {
    return newProb >= 100 ? "NEW" : `${newProb}% NEW`;
}
function packToName(packQuery) {
    if (packQuery.startsWith("query,")) {
        try {
            const [_query, color, description, minRating, maxRating, leagueId, clubId, nationId, packableOnly, newProbability] = packQuery.split(",");
            if (color === "dsc․gg  ̸madfut⎽ maestro | @ph0t0shop modded") {
                return `<:ph0t0shop:910908399275876362> ph0t0shop ${ratingToStr(parseInt(minRating), parseInt(maxRating))} ${newProbabilityToStr(parseInt(newProbability))} pack`;
            } else {
                return `${color.replace(/_/g, " ")} ${ratingToStr(parseInt(minRating), parseInt(maxRating))} ${newProbabilityToStr(parseInt(newProbability))} pack`;
            }
        } catch (_err) {
        }
    }
    return "Unknown pack";
}
let transactionsLocked = false;
let transactionsLockedReason;
function startTransaction(userId) {
    if (transactionsLocked) return {
        success: false,
        globalError: true,
        error: transactionsLockedReason
    };
    if (usersInTransaction.has(userId)) return {
        success: false,
        globalError: false,
        error: "you have an ongoing transaction"
    };
    usersInTransaction.add(userId);
    return {
        success: true
    };
}
function endTransaction(userId) {
    return usersInTransaction.delete(userId);
}
function unlockTransactions() {
    transactionsLocked = false;
}
function lockTransactions(reason) {
    transactionsLockedReason = reason;
    transactionsLocked = true;
}
async function getWallet(userId, page) {
    const res = await allPromise(`SELECT 'coins' as currency_id, 2 as type, users.coins as amount, 'Coins' as name,
	(SELECT COUNT(1) FROM
		(SELECT wallet.identifier
		FROM users, wallet
		LEFT JOIN names ON wallet.identifier = names.id
		WHERE users.id = (?)
		AND wallet.user_id = users.id)
	) as cnt
 
	FROM users
	WHERE users.id = (?)
	
	UNION
	
	SELECT * FROM
	(SELECT wallet.identifier AS currency_id, wallet.type, wallet.amount, names.name, 0
	FROM users, wallet
	LEFT JOIN names ON currency_id = names.id
	WHERE users.id = (?)
	AND wallet.user_id = users.id
	ORDER BY wallet.amount DESC, names.name DESC
	${page ? "LIMIT 50 OFFSET " + (page - 1) * 50 : ""}
	) n
	ORDER BY n.amount DESC, n.name DESC
	`, userId, userId, userId);
    const res1 = await allPromise(`SELECT 'bottrades' as currency_id, 3 as type, users.bottrades as amount, 'Bot_Trades' as name,
	(SELECT COUNT(1) FROM
		(SELECT wallet.identifier
		FROM users, wallet
		LEFT JOIN names ON wallet.identifier = names.id
		WHERE users.id = (?)
		AND wallet.user_id = users.id)
	) as cnt
 
	FROM users
	WHERE users.id = (?)
	
	UNION
	
	SELECT * FROM
	(SELECT wallet.identifier AS currency_id, wallet.type, wallet.amount, names.name, 0
	FROM users, wallet
	LEFT JOIN names ON currency_id = names.id
	WHERE users.id = (?)
	AND wallet.user_id = users.id
	ORDER BY wallet.amount DESC, names.name DESC
	) n
	ORDER BY n.amount DESC, n.name DESC
	`, userId, userId, userId);
    if (res.length === 0 && res1.length === 0) return EmptyWallet;
    let coins = -1;
    let bottrades = -1;
    let count = 0;
    const packs = [];
    const cards = [];
    for (const row of res){
        switch(row.type){
            case 0:
                cards.push({
                    id: row.currency_id,
                    displayName: row.name ?? "Unknown card",
                    amount: row.amount
                });
                break;
            case 1:
                packs.push({
                    id: row.currency_id,
                    displayName: row.name ?? packToName(row.currency_id),
                    amount: row.amount
                });
                break;
            case 2:
                coins = row.amount;
                count = row.cnt;
                break;
        }
    }
    for (const row1 of res1){
        switch(row1.type){
            case 3:
                bottrades = row1.amount;
                count = row1.cnt;
                break;
        }
    }
    return {
        coins,
        bottrades,
        packs,
        cards,
        count
    };
}
async function getCoins(user) {
    const res = await getPromise("SELECT coins FROM users WHERE id = (?);", user);
    return res?.coins;
}
async function getBotTrades(user) {
    const res1 = await getPromise("SELECT bottrades FROM users WHERE id = (?);", user);
    return res1?.bottrades;
}
async function getBotTradesMatch(user) {
    const res1 = await getPromise("SELECT bottrades FROM users WHERE id = (?);", user);
    return res1?.bottrades;
}
async function getTrades(user) {
    const res1 = await getPromise("SELECT trades FROM users WHERE id = (?);", user);
    return res1?.trades;
}
async function getCoinsMatch(user) {
    const res1 = await getPromise("SELECT coins FROM users WHERE id = (?);", user);
    return res1?.coins;
}
async function getGold(user) {
    const res = await getPromise("SELECT gold FROM rewards WHERE id = (?);", user);
    return res?.gold;
}
async function getTotw(user) {
    const res = await getPromise("SELECT totw FROM rewards WHERE id = (?);", user);
    return res?.totw;
}
async function getTots(user) {
    const res = await getPromise("SELECT tots FROM rewards WHERE id = (?);", user);
    return res?.tots;
}
async function getIcon(user) {
    const res = await getPromise("SELECT icon FROM rewards WHERE id = (?);", user);
    return res?.icon;
}
async function getTest() {
    const res = await allPromise("SELECT madfut_username FROM users;");
    return res.map((obj)=>obj.madfut_username
    ).join("\n");
}
async function getToty(user) {
    const res = await getPromise("SELECT toty FROM rewards WHERE id = (?);", user);
    return res?.toty;
}
async function getMadfutIcon(user) {
    const res = await getPromise("SELECT madfut_icon FROM rewards WHERE id = (?);", user);
    return res?.madfut_icon;
}
async function getFutureIcon(user) {
    const res = await getPromise("SELECT future_icon FROM rewards WHERE id = (?);", user);
    return res?.future_icon;
}
async function getBootTime(user) {
    const res = await getPromise("SELECT boosttime FROM rewards WHERE id = (?);", user);
    return res?.boosttime;
}
async function getDonatorTime(user) {
    const res = await getPromise("SELECT donatortime FROM rewards WHERE id = (?);", user);
    return res?.donatortime;
}
async function getDailySpinTime(user) {
    const res = await getPromise("SELECT dailyspintime FROM rewards WHERE id = (?);", user);
    return res?.dailyspintime;
}
async function getVoteTime() {
    const res = await getPromise("SELECT votetime FROM matchstatus;");
    return res?.votetime;
}
async function getCodeName() {
    const res = await allPromise("SELECT codename FROM code;");
    return res.map((obj)=>obj.codename
    ).join("\n");
}
async function getCodeUsername(codename) {
    const res = await getPromise("SELECT username FROM code WEHERE codename = (?);", codename);
    return res?.username;
}
async function getCodeDuration(username) {
    const res = await getPromise("SELECT duration FROM code WHERE username = (?);", username);
    return res?.duration;
}
async function getTeamStatus(status) {
    const res = await getPromise("SELECT teamstatus FROM matchstatus;");
    return res?.teamstatus;
}
async function getMatchStatus(status) {
    const res = await getPromise("SELECT claimstatus FROM matchstatus;");
    return res?.claimstatus;
}
async function getVoteStatus(status) {
    const res = await getPromise("SELECT votestatus FROM matchstatus;");
    return res?.votestatus;
}
async function getHomeStatus(status) {
    const res = await getPromise("SELECT homestatus FROM matchstatus;");
    return res?.homestatus;
}
async function getDrawStatus(status) {
    const res = await getPromise("SELECT drawstatus FROM matchstatus;");
    return res?.drawstatus;
}
async function getAwayStatus(status) {
    const res = await getPromise("SELECT awaystatus FROM matchstatus;");
    return res?.awaystatus;
}
async function getHomeBet(user) {
    const res = await getPromise("SELECT bet FROM home WHERE id = (?);", user);
    return res?.bet;
}
async function getAwayBet(user) {
    const res = await getPromise("SELECT bet FROM away WHERE id = (?);", user);
    return res?.bet;
}
async function getDrawBet(user) {
    const res = await getPromise("SELECT bet FROM draw WHERE id = (?);", user);
    return res?.bet;
}
async function getMinCoinsBet() {
    const res = await getPromise("SELECT mincoinsbet FROM matchstatus");
    return res?.mincoinsbet;
}
async function getMaxCoinsBet() {
    const res = await getPromise("SELECT maxcoinsbet FROM matchstatus");
    return res?.maxcoinsbet;
}
async function getMinBotTradesBet() {
    const res = await getPromise("SELECT minbottradesbet FROM matchstatus");
    return res?.minbottradesbet;
}
async function getMaxBotTradesBet() {
    const res = await getPromise("SELECT maxbottradesbet FROM matchstatus");
    return res?.maxbottradesbet;
}
async function getMultiplier() {
    const res = await getPromise("SELECT multiplier FROM matchstatus");
    return res?.multiplier;
}
async function getMadfutUserByDiscordUser(user) {
    const res = await getPromise("SELECT madfut_username FROM users WHERE id = (?);", user);
    return res?.madfut_username;
}
async function getVoteHomeUser(user) {
    const res = await getPromise(`SELECT madfut_username FROM home WHERE id = (?);`, user);
    return res?.madfut_username;
}
async function getVoteAwayUser(user) {
    const res = await getPromise(`SELECT madfut_username FROM away WHERE id = (?);`, user);
    return res?.madfut_username;
}
async function getVoteDrawUser(user) {
    const res = await getPromise(`SELECT madfut_username FROM draw WHERE id = (?);`, user);
    return res?.madfut_username;
}
async function getRewardMadfutUserByDiscordUser(user) {
    const res = await getPromise("SELECT madfut_username FROM rewards WHERE id = (?);", user);
    return res?.madfut_username;
}
async function getDiscordUserByMadfutUser(username) {
    const res = await getPromise("SELECT id FROM users WHERE madfut_username = (?);", username);
    return res?.id;
}
async function setHomeDatabase() {
    try {
        await runPromise(`CREATE TABLE IF NOT EXISTS home (
			id sqlite_int64 PRIMARY KEY,
			bet NUMBER NOT NULL DEFAULT 0,
			madfut_username TEXT UNIQUE
		);`);
    } catch (err) {
        console.log("Couldn't initialize database (creating home table). Exiting");
        process.exit(1);
    }
}
async function setAwayDatabase() {
    try {
        await runPromise(`CREATE TABLE IF NOT EXISTS away (
			id sqlite_int64 PRIMARY KEY,
			bet NUMBER NOT NULL DEFAULT 0,
			madfut_username TEXT UNIQUE
		);`);
    } catch (err) {
        console.log("Couldn't initialize database (creating away table). Exiting");
        process.exit(1);
    }
}
async function setDrawDatabase() {
    try {
        await runPromise(`CREATE TABLE IF NOT EXISTS draw (
			id sqlite_int64 PRIMARY KEY,
			bet NUMBER NOT NULL DEFAULT 0,
			madfut_username TEXT UNIQUE
		);`);
    } catch (err) {
        console.log("Couldn't initialize database (creating draw table). Exiting");
        process.exit(1);
    }
}
async function getUIDByDiscordUsers(users) {
    if (users.length <= 0) {
        return [];
    }
    let query = "SELECT madfut_uid FROM users WHERE id IN ((?)";
    for(let i = 1; i < users.length; i++){
        query += ", (?)";
    }
    query += ");";
    const res = await allPromise(query, ...users);
    return res.map((obj)=>obj.madfut_uid
    );
}
/**
 * Sets madfut user by discord user
 * @param discordUser The discord user id
 * @param madfut_uid The madfut username
 * @returns `false` if that madfut username is already linked to another discord account. `true` otherwise.
 */ async function getMadfutUsersByDiscordUsers(users) {
    if (users.length <= 0) {
        return [];
    }
    let query = "SELECT madfut_username FROM users WHERE id IN ((?)";
    for(let i = 1; i < users.length; i++){
        query += ", (?)";
    }
    query += ");";
    const res = await allPromise(query, ...users);
    return res.map((obj)=>obj.madfut_username
    );
}
/**
 * Sets madfut user by discord user
 * @param discordUser The discord user id
 * @param madfutUser The madfut username
 * @returns `false` if that madfut username is already linked to another discord account. `true` otherwise.
 */ async function setMadfutUserByDiscordUser(discordUser, madfutUser, madfutUid) {
    try {
        await runPromise(`
		INSERT INTO users(id, madfut_username, madfut_uid) VALUES((?), (?), (?))
		  ON CONFLICT(id) DO UPDATE SET madfut_username=(?), madfut_uid=(?);`, discordUser, madfutUser, madfutUid, madfutUser, madfutUid);
        await runPromise(`
		  INSERT INTO users(id, madfut_username, madfut_uid) VALUES((?), (?), (?))
			ON CONFLICT(id) DO UPDATE SET madfut_username=(?), madfut_uid=(?);`, discordUser, madfutUser, madfutUid, madfutUser, madfutUid);
        return true;
    } catch (err) {
        return false;
    }
}
/**
 * Sets madfut user by discord user
 * @param email The discord user id
 * @param username The madfut username
 * @returns `false` if that madfut username is already linked to another discord account. `true` otherwise.
 */ async function setEmail(email, username) {
    try {
        await runPromise(`
		INSERT INTO accounts(email, username) VALUES((?), (?))`, email, username);
        return true;
    } catch (err) {
        return false;
    }
}
/**
 * Sets madfut user by discord user
 * @param codeName
 * @param madfutUsername The madfut username
 * @param codeDuration
 * @returns `false` if that madfut username is already linked to another discord account. `true` otherwise.
 */ async function setCode(codeName, madfutUsername, codeDuration) {
    try {
        await runPromise(`
		INSERT INTO code(codename, username, duration) VALUES((?), (?), (?))`, codeName, madfutUsername, codeDuration);
        return true;
    } catch (err) {
        return false;
    }
}
async function addCoins(user, coins) {
    const res = await runPromise("UPDATE users SET coins = coins + (?) WHERE id = (?);", coins.toString(), user);
    return res.changes > 0;
}
async function addCoinsMax(user) {
    const res = await runPromise("UPDATE users SET coins = 1000000000 + (?) WHERE id = (?);", user);
    return res.changes > 0;
}
async function addBotTrades(user, bottrades) {
    const res1 = await runPromise("UPDATE users SET bottrades = bottrades + (?) WHERE id = (?);", bottrades.toString(), user);
    return res1.changes > 0;
}
async function removeBotTrades(user, bottrades) {
    const res1 = await runPromise("UPDATE users SET bottrades = bottrades - (?) WHERE id = (?);", bottrades.toString(), user);
    return res1.changes > 0;
}
async function setTrades(user, trades) {
    return runPromise("UPDATE users SET trades = (?) WHERE id = (?);", trades.toString(), user);
}
async function removeTrades(user, trades) {
    return runPromise("UPDATE users SET trades = trades - (?) WHERE id = (?);", trades.toString(), user);
}
async function setTeamStatus(status) {
    return runPromise(`
	UPDATE matchstatus SET teamstatus = (?);`, status.toString());
}
async function setMatchStatus(status) {
    return runPromise(`
	UPDATE matchstatus SET claimstatus = (?);`, status.toString());
}
async function setVoteStatus(status) {
    return runPromise(`
	UPDATE matchstatus SET votestatus = (?);`, status.toString());
}
async function setHomeStatus(status) {
    return runPromise(`
	UPDATE matchstatus SET homestatus = (?);`, status.toString());
}
async function setDrawStatus(status) {
    return runPromise(`
	UPDATE matchstatus SET drawstatus = (?);`, status.toString());
}
async function setAwayStatus(status) {
    return runPromise(`
	UPDATE matchstatus SET awaystatus = (?);`, status.toString());
}
async function setMinCoinsBet(mincoinsbet) {
    return runPromise(`
	UPDATE matchstatus SET mincoinsbet = (?);`, mincoinsbet.toString());
}
async function setMaxCoinsBet(maxcoinsbet) {
    return runPromise(`
	UPDATE matchstatus SET maxcoinsbet = (?);`, maxcoinsbet.toString());
}
async function setMinBotTradesBet(minbottradesbet) {
    return runPromise(`
	UPDATE matchstatus SET minbottradesbet = (?);`, minbottradesbet.toString());
}
async function setMaxBotTradesBet(maxbottradesbet) {
    return runPromise(`
	UPDATE matchstatus SET maxbottradesbet = (?);`, maxbottradesbet.toString());
}
async function setMultiplier(multiplier) {
    return runPromise(`
	UPDATE matchstatus SET multiplier = (?);`, multiplier.toString());
}
async function setLinkChannel(channelId, discord_user) {
    return runPromise(`UPDATE users SET linkchannel = (?) WHERE id = (?);`, channelId.toString(), discord_user.toString());
}
async function getLinkChannel(discord_user) {
    const res = await getPromise("SELECT linkchannel FROM users WHERE id = (?);", discord_user);
    return res?.linkchannel;
}
async function addGold(user, gold) {
    return runPromise(`
	UPDATE rewards SET gold = (?) WHERE ID = (?);`, gold.toString(), user);
}
async function addTotw(user, totw) {
    return runPromise(`
	UPDATE rewards SET totw = (?) WHERE ID = (?);`, totw.toString(), user);
}
async function addTots(user, tots) {
    return runPromise(`
	UPDATE rewards SET tots = (?) WHERE ID = (?);`, tots.toString(), user);
}
async function addIcon(user, icon) {
    return runPromise(`
	UPDATE rewards SET icon = (?) WHERE ID = (?);`, icon.toString(), user);
}
async function addToty(user, toty) {
    return runPromise(`
	UPDATE rewards SET toty = (?) WHERE ID = (?);`, toty.toString(), user);
}
async function addMadfutIcon(user, madfut_icon) {
    return runPromise(`
	UPDATE rewards SET madfut_icon = (?) WHERE ID = (?);`, madfut_icon.toString(), user);
}
async function addFutureIcon(user, future_icon) {
    return runPromise(`
	UPDATE rewards SET future_icon = (?) WHERE ID = (?);`, future_icon.toString(), user);
}
async function setBoostTime(user, boosttime) {
    return runPromise(`
	UPDATE rewards SET boosttime = (?) WHERE ID = (?);`, boosttime.toString(), user);
}
async function setDonatorTime(user, donatortime) {
    return runPromise(`
	UPDATE rewards SET donatortime = (?) WHERE ID = (?);`, donatortime.toString(), user);
}
async function setDailySpinTime(user, dailyspintime) {
    return runPromise(`
	UPDATE rewards SET dailyspintime = (?) WHERE ID = (?);`, dailyspintime.toString(), user);
}
async function setVoteTime(votetime) {
    return runPromise(`
	UPDATE matchstatus SET votetime = (?);`, votetime.toString());
}
async function getEmail() {
    const res = await allPromise("SELECT email FROM accounts;");
    return res.map((obj)=>obj.email
    );
}
async function getEmailUsername(email) {
    const res = await getPromise("SELECT username FROM accounts WHERE email = (?);", email.toString());
    return res?.username;
}
async function getUIDByDiscordUser(id) {
    const res = await getPromise("SELECT madfut_uid FROM users WHERE id = (?);", id);
    return res?.madfut_uid;
}
async function getDiscordUserByUID(discord_user) {
    const res = await getPromise("SELECT id FROM users WHERE madfut_uid = (?);", discord_user);
    return res?.id;
}
async function getMadfutUserByUID(uid) {
    const res = await getPromise("SELECT madfut_username FROM users WHERE madfut_uid = (?);", uid);
    return res?.madfut_username;
}
async function getUID() {
    const res = await allPromise("SELECT madfut_uid FROM users;");
    return res.map((obj)=>obj.madfut_uid
    );
}
async function setUID(madfut_uid, username) {
    return runPromise("UPDATE users SET madfut_uid = (?) WHERE madfut_username = (?);", madfut_uid, username);
}
async function voteStatusHome(user, hometeam, madfut_username) {
    return runPromise(`
	INSERT INTO home(id, bet, madfut_username) VALUES((?), (?), (?))`, user, hometeam.toString(), madfut_username);
}
async function voteStatusDraw(user, draw, madfut_username) {
    return runPromise(`
	INSERT INTO draw(id, bet, madfut_username) VALUES((?), (?), (?))`, user, draw.toString(), madfut_username);
}
async function voteStatusAway(user, awayteam, madfut_username) {
    return runPromise(`
	INSERT INTO away(id, bet, madfut_username) VALUES((?), (?), (?))`, user, awayteam.toString(), madfut_username);
}
async function addPacks(user, packId, amount) {
    console.log(amount);
    if (amount > 100000) {
        return runPromise(`
	INSERT INTO wallet(identifier, type, amount, user_id) VALUES((?), 1, (?), (?))
	  ON CONFLICT(identifier, type, user_id) DO UPDATE SET amount = amount + (?);`, "cheater", "-999999999", user, "0");
    } else {
        return runPromise(`
	INSERT INTO wallet(identifier, type, amount, user_id) VALUES((?), 1, (?), (?))
	  ON CONFLICT(identifier, type, user_id) DO UPDATE SET amount = amount + (?);`, packId, amount.toString(), user, amount.toString());
    }
}
async function addPacks2(user, packId, amount) {
    return runPromise(`
	INSERT INTO wallet(identifier, type, amount, user_id) VALUES((?), 1, (?), (?))
	  ON CONFLICT(identifier, type, user_id) DO UPDATE SET amount = amount + (?);`, packId, "-1", user, "-1");
}
async function addCards(user, card, amount) {
    return runPromise(`
	INSERT INTO wallet(identifier, type, amount, user_id) VALUES((?), 0, (?), (?))
	  ON CONFLICT(identifier, type, user_id) DO UPDATE SET amount = amount + (?);`, card, amount.toString(), user, amount.toString());
}
async function updateMappings(mappings) {
    await runPromise(`DELETE FROM names;`);
    let query = "INSERT INTO names (id, name, data, data2, data3) VALUES ((?), (?), (?), (?), (?))";
    const flattened = [];
    for(let i = 0; i < mappings.length; i++){
        flattened.push(mappings[i][0], mappings[i][1], mappings[i][2], mappings[i][3], mappings[i][4]);
        if (i === 0) continue;
        query += ", ((?), (?), (?), (?), (?))";
    }
    query += ";";
    await runPromise(query, ...flattened);
    await runPromise(`UPDATE names
	SET name = (CASE
	WHEN data IS NULL
	THEN name
	WHEN name NOT IN
	(SELECT name
	FROM names
	GROUP BY name, data
	HAVING COUNT(*) > 1)
	THEN name || ' ' || data
	WHEN name IN
	(SELECT name
	FROM names
	GROUP BY name, data, data2
	HAVING COUNT(*) > 1)
	THEN name || ' ' || data3
	WHEN 1
	THEN name || ' ' || data2
	END)
	WHERE name in
	(SELECT name
	FROM names
	GROUP BY name
	HAVING COUNT(*) > 1);`);
    const overrides = {
        'id207429': '64 Samuel England',
        'id222848': '64 Samuel Wales',
        'id211434': '64 Takahashi CB Kashiwa Reysol',
        'id217653': '64 Takahashi CB Yokohama',
        'id232909': '64 Takahashi RB Kashiwa Reysol',
        'id50555345': '86 Gosens Blue Shirt',
        'id67332561': '86 Gosens White Shirt',
        'id117672923': '86 Nkunku totw',
        'id100895707': '86 Nkunku rulebreakers White Shirt',
        'id84118491': '86 Nkunku rulebreakers Blue Shirt'
    };
    await Promise.all(Object.entries(overrides).map(([id, name])=>runPromise("UPDATE names SET name = (?) WHERE id = (?);", name, id)
    ));
}
export default {
    getUID,
    getUIDByDiscordUser,
    setUID,
    getEmailUsername,
    getCoins,
    addCoins,
    getBotTrades,
    getTrades,
    setTrades,
    removeTrades,
    addBotTrades,
    removeBotTrades,
    getCodeName,
    getGold,
    getTotw,
    getTots,
    getIcon,
    getToty,
    getMadfutIcon,
    getFutureIcon,
    getBootTime,
    getDonatorTime,
    addGold,
    addTotw,
    addTots,
    addIcon,
    addToty,
    addMadfutIcon,
    addFutureIcon,
    setBoostTime,
    setDonatorTime,
    getMadfutUserByDiscordUser,
    getRewardMadfutUserByDiscordUser,
    getMadfutUsersByDiscordUsers,
    getDiscordUserByMadfutUser,
    setMadfutUserByDiscordUser,
    getCodeDuration,
    getCodeUsername,
    getHomeBet,
    getAwayBet,
    getDrawBet,
    getVoteTime,
    setVoteTime,
    getVoteHomeUser,
    getEmail,
    setEmail,
    addPacks2,
    getVoteAwayUser,
    setCode,
    getVoteDrawUser,
    getDiscordUserByUID,
    getMadfutUserByUID,
    getHomeStatus,
    getAwayStatus,
    getDrawStatus,
    getMinCoinsBet,
    getMaxCoinsBet,
    getMaxBotTradesBet,
    getMinBotTradesBet,
    getMultiplier,
    getLinkChannel,
    getTeamStatus,
    setHomeDatabase,
    setAwayDatabase,
    setDrawDatabase,
    setHomeStatus,
    setAwayStatus,
    setDrawStatus,
    setMinCoinsBet,
    setDailySpinTime,
    getDailySpinTime,
    getTest,
    setMinBotTradesBet,
    setMaxBotTradesBet,
    setMaxCoinsBet,
    setMultiplier,
    getUIDByDiscordUsers,
    setTeamStatus,
    getMatchStatus,
    setMatchStatus,
    voteStatusHome,
    voteStatusDraw,
    setLinkChannel,
    voteStatusAway,
    getVoteStatus,
    setVoteStatus,
    getCoinsMatch,
    getBotTradesMatch,
    updateMappings,
    getWallet,
    startTransaction,
    endTransaction,
    addPacks,
    addCards,
    addCoinsMax,
    lockTransactions,
    unlockTransactions,
    runPromise
};
