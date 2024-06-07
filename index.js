import MadfutClient, { ProfileProperty } from './madfutclient.js';
import { bot } from "./discord.js";
import { formatNum, normalize, sleep, getRandomInt, extractAmount } from "./util.js";
import { Constants } from 'eris';
import { once } from 'events';
import config from './config.js';
import { ObjectSet } from './util.js';
console.log('test')
import db from "./db.js";
const cooldown = new Map();
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
let madfutclient = async ()=>{

    const madfutClient = new MadfutClient(config.appCheckToken);
    while(!madfutClient.loggedIn){
        await madfutClient.login().catch(async (err)=>{
            console.log(err)
        });
    }
    return madfutClient;
};


const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
const characters1 = '1234567890';

function generateNum(length) {
    let result = '';
    const charactersLength = characters1.length;
    for(let i = 0; i < length; i++){
        result += characters1.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function logMessage(action, userId, coins, cards, packs) {
    bot.sendMessage("1060569989356212285", `Action: ${action}\nUserId: ${userId}\nTag: <@${userId}>\nCoins: ${coins}\nCards: ${cards}\nPacks: ${packs}\nUnix: ${Math.round(Date.now() / 1000)}`);
    return;
}
function logMessagecheater(action, userId, coins, cards, packs) {
    bot.sendMessage("1060675426260885505", `Action: ${action}\nUserId: ${userId}\nTag: <@${userId}>\nCoins: ${coins}\nCards: ${cards}\nPacks: ${packs}\nUnix: ${Math.round(Date.now() / 1000)}`);
    return;
}
// BOTCODE -------------------
async function botCodeListenerSwitcher() {
    const madfut = new MadfutClient(config.appCheckToken, getRandomInt(1000000));

    try {
        await madfut.login();
    } catch (error) {
        console.log(`Error logging in: ${error}`);
        return botCodeListenerSwitcher();
    }
    return madfut;
}
let botCodeTimeout = false;
let invitename2 = "madfut24";
async function botCodePacks(interaction, username, amount) {
    console.log(`sent ${username} ${amount} trades`);
    let ftRunning = "2";
    let times = amount;
    intervalfuncft();
    let count = 0;
    async function intervalfuncft() {
        let madfutClient;
        madfutClient = await madfutclient();
        for(let i = 0; i < times;){
            
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
              //traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(username, invitename2);
                console.log(`${username} accepted invite.`);
            } catch  {
                if (++count > 4) return;
                console.log(`${username} rejected invite.`);
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: [],
                        giveCoins: 10000000,
                        givePacks: packs
                    })
                );
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}

async function botCodeCards(interaction, username, amount) {
    console.log(`sent ${username} ${amount} trades`);
    let ftRunning = "2";
    let times = amount;
    intervalfuncft();
    let count = 0;
    async function intervalfuncft() {
        let madfutClient;
        madfutClient = await madfutclient();
        for(let i = 0; i < times;){
            
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
              //traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(username, invitename2);
                console.log(`${username} accepted invite.`);
            } catch  {
                if (++count > 4) return;
                console.log(`${username} rejected invite.`);
                continue;
            }
            try {
                await freetradev2(username, 1)
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                await madfutClient.logout();
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}

async function addListener(interaction, codename, tradeType, timeoutMinutes, MSG) {
    let madfutClient = await botCodeListenerSwitcher();

    try {
        let userId = madfutClient.uid;
        console.log(`Starting Code: ${codename}`);
        await madfutClient.setBotCodeUsername(codename);
        console.log(`Started: ${codename}`);

        if (tradeType === "packs") {
            madfutClient.addInviteListener(async (uid, codename, timeoutMinutes, tradeType) => {
                console.log(`User invited ${codename}: ${uid}`);
                try {
                    await botCodePacks(interaction, uid, 5);
                } catch (error) {
                    console.log(`Error in makeTrade: ${error}`);
                }
            }, userId, codename);
        } else if (tradeType === "cards") {
            madfutClient.addInviteListener(async (uid, codename, timeoutMinutes, tradeType) => {
                console.log(`User invited ${codename}: ${uid}`);
                try {
                    await botCodeCards(interaction, uid, 5);
                } catch (error) {
                    console.log(`Error in makeTrade: ${error}`);
             
                }
            }, userId, codename);
        }
        setTimeout(async () => {
            console.log(`Timeout reached. Stopping listener for ${codename}`);
            botCodeTimeout = true;
            await madfutClient.logout();
        }, timeoutMinutes * 60 * 1000);
    } catch (err) {
        console.log(`We encountered an error with this account, switching.`);
        addListener(interaction, codename, tradeType);
    }
}

bot.on("code", async (interaction, codename, tradeType, duration)=>{
    if (duration > 15) {
        interaction.createMessage({
            embeds: [
                {
                    color: 0xD8BFD8,
                    description: "Maximum duration is 15 minutes!"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    if(tradeType === "packs") {
    if(codename.length > '12') {
 interaction.createMessage({
        embeds: [
            {
                color: 0xD8BFD8,
                description: `12 is the max amount of characters the code name can be!`,
                  
            }
        ],
     flags: Constants.MessageFlags.EPHEMERAL,
    });
} else if(codename.length < "5") {
     interaction.createMessage({
        embeds: [
            {
                color: 0xD8BFD8,
                description: `5 is the lowest amount of characters the code name can be!`,
                  
            }
        ],
         flags: Constants.MessageFlags.EPHEMERAL,
    });
} else {
    let msg = interaction.createMessage({
        embeds: [
            {
                title: "Success",
                color: 0xD8BFD8,
                description: `Created Packs code: ${codename}\n`,  
            }
        ]
        
    });

    // Run indefinitely
    try {
        await addListener(interaction, codename, "packs", duration, msg);
    } catch (error) {
        console.log(`Error in code listener: ${error}`);
    }
}
    }
    if(tradeType === "wishlist"){
            if(codename.length > '12') {
 interaction.createMessage({
     embeds: [
            {
                color: 0xD8BFD8,
                description: `12 is the max amount of characters the code name can be!`,
                 
            }
        ],
     flags: Constants.MessageFlags.EPHEMERAL,
    });
} else if(codename.length < "5") {
     interaction.createMessage({
        embeds: [
            {
                color: 0xD8BFD8,
                description: `5 is the lowest amount of characters the code name can be!`,
               
            }
        ],
         flags: Constants.MessageFlags.EPHEMERAL,
    });
} else {
    let msg = interaction.createMessage({
        embeds: [
            {
                title: "Success",
                color: 0xD8BFD8,
                description: `Created wishlist code: ${codename}\n`,  
            }
        ]
        
    });
    try {
        await addListener(interaction, codename, "cards", duration, msg);
    } catch (error) {
        console.log(`Error in code listener: ${error}`);
    }
}
    }
});

//BOTCODE END -----------------------------

async function freeTrade(username, amount) {
    console.log(`sent ${username} ${amount} trades`);
    let ftRunning = "2";
    let times = amount;
    intervalfuncft();
    let count = 0;
    async function intervalfuncft() {
        let madfutClient;
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
                console.log(`${username} accepted invite  MAIN.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${username} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: false
                    })
                );
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
let amount1 = 0;
async function freeTradeUnlimited(username, coins, packs) {
    while(true){
        let madfutClient = await madfutclient();
        let tradeRef;
        try {
            tradeRef = await madfutClient.inviteUser(username, `madfut24`);
            console.log(`${username} accepted invite.`);
        } catch  {
            console.log(`${username} rejected invite or timed out.`);
            break;
        }
        try {
            await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                    giveCoins: 10000000,
                    givePacks: false
                })
            );
            console.log(`Completed unlimited trade with ${username}`);
            amount1++;
            await madfutClient.logout();
            console.log("switched");
        } catch (_err) {
            console.log(`Unlimited trade with ${username} failed: Player left`);
            await madfutClient.logout();
        }
    }
}
async function sendTrades(interaction, userId, cards, packs, coins, amount) {
    const message = await bot.sendMessage(interaction.channel.id, {
        embeds: [
            {
                color: 3066993,
                description: `${userId} has ${amount} trade(s)`,
                footer: {
                    text: "Don't delete this message until the counter is at zero!"
                }
            }
        ]
    });
    let madfutClient1 = await madfutclient();
    let ftRunning = "2";
    console.log(`sent ${userId} ${amount} trades`);
    let enablePacks;
    if (packs === true) {
        let packs = [
            {
                pack: "query,MODDED PACK FOR MADFUT,,64,99,-1,-1,-1,false,100",
                amount: 1
            },
            {
                pack: "query,MODDED PACK FOR MADFUT,,90,99,-1,-1,-1,false,100",
                amount: 1
            },
            {
                pack: "query,MODDED PACK FOR MADFUT,,80,99,-1,-1,-1,false,100",
                amount: 1
            }, 
        ];
        enablePacks = packs;
    } else if (packs === false) {
        enablePacks = [];
    }
    let times = amount;
    intervalfunc();
    let count = 0;
    async function intervalfunc() {
        for(let i = 0; i < times;){
            let madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return await madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(userId);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
                //${generateString(7)}
                console.log(`${userId} accepted invite.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${userId} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                if (cards === true) {
                    await madfutClient.doTrade(tradeRef, async (profile)=>({
                            receiveCoins: false,
                            receiveCards: false,
                            receivePacks: false,
                            giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                            giveCoins: coins,
                            givePacks: enablePacks
                        })
                    );
                } else if (cards === false) {
                    await madfutClient.doTrade(tradeRef, async (profile)=>({
                            receiveCoins: false,
                            receiveCards: false,
                            receivePacks: false,
                            giveCards: [],
                            giveCoins: coins,
                            givePacks: enablePacks
                        })
                    );
                }
                times = times - 1;
                await bot.editMessage(interaction.channel.id, message.id, {
                    embeds: [
                        {
                            color: 3066993,
                            description: `${userId} have ${times} trade(s) left`,
                            footer: {
                                text: "Don't delete this message until the counter is at zero!"
                            }
                        }
                    ]
                });
                await madfutClient.logout();
                console.log(`${userId} has ${times} left`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfunc();
                }, 2000);
            } catch (_err) {
                console.log(`Unlimited trade with ${userId} failed: Player left`);
            }
        }
    }
    madfutClient1 && madfutClient1?.logout();
}

bot.on("send", async (interaction, userId, cards, packs, coins, amount)=>{
    let username = userId.toLowerCase();
    await sendTrades(interaction, username, cards, packs, coins, amount);
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: "```✅ Command successful.```"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
});
async function freetradepacks(interaction, userId, amount, coins, packs) {
    // const message = await interaction.createFollowup({
    console.log(`sent ${userId} ${amount} trades`);
    const message = await bot.sendMessage(interaction.channel.id, {
        embeds: [
            {
                color: 3066993,
                description: `${userId} has ${amount} trade(s)`,
                footer: {
                    text: "Don't delete this message until the counter is at zero!"
                }
            }
        ]
    });
    let madfutClient = await madfutclient();
    const traderName1 = await madfutClient.returnUserInfo(userId);
    console.log(traderName1);
    let ftRunning = "2";
    let times = amount;
    let count = 0;
    intervalfuncft();
    async function intervalfuncft() {
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(userId);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
                console.log(`${userId} accepted invite.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${userId} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: false
                    })
                );
                --times;
                console.log(`${userId} ${times} trades left`);
                count > 0 && count--;
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                await bot.editMessage(message.channel.id, message.id, {
                    embeds: [
                        {
                            color: 3066993,
                            description: `${userId} has ${times} trade(s)`,
                            footer: {
                                text: "Don't delete this message until the counter is at zero!"
                            }
                        }
                    ]
                });
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${userId} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
function verifyWallet(wallet, coins, cards, packs, verb, walletOwner) {
    if (wallet.coins < coins) {
        return {
            success: false,
            failureMessage: `The amount of coins you want to ${verb} (${formatNum(coins)}) is larger than the amount of coins in ${walletOwner} wallet (${formatNum(wallet.coins)}).`
        };
    }
    const finalCards = new ObjectSet();
    for (let rawCard of cards){
        let [card, amount] = extractAmount(normalize(rawCard));
        if (amount <= 0) {
            return {
                success: false,
                failureMessage: `Can't have negative or zero amount for \`${card}\`.`
            };
        }
        const foundCard = wallet.cards.find((walletCard)=>normalize(walletCard.displayName).startsWith(card)
        );
        if (!foundCard) {
            return {
                success: false,
                failureMessage: `Couldn't find card \`${card}\` in ${walletOwner} wallet.`
            };
        }
        if (foundCard.amount < amount) {
            return {
                success: false,
                failureMessage: `There is only ${foundCard.amount} ${foundCard.displayName} of the desired ${amount} in ${walletOwner} wallet.`
            };
        }
        if (finalCards.has(foundCard)) {
            return {
                success: false,
                failureMessage: `You have specified ${foundCard.displayName} multiple times for ${walletOwner} wallet. Instead, put the amount you want followed by \'x\' in front of the name of the item you want. For example, \`3x98pele\` will pick the 98 Pelé card 3 times.`
            };
        }
        finalCards.add({
            displayName: foundCard.displayName,
            amount,
            id: foundCard.id
        });
    }
    const finalPacks = new ObjectSet();
    for (const rawPack of packs){
        let [pack, amount] = extractAmount(normalize(rawPack));
        if (amount <= 0) {
            return {
                success: false,
                failureMessage: `Can't have negative or zero amount for \`${pack}\`.`
            };
        }
        const foundPack = wallet.packs.find((walletPack)=>normalize(walletPack.displayName).startsWith(normalize(pack))
        );
        if (!foundPack) {
            return {
                success: false,
                failureMessage: `Couldn't find pack \`${pack}\` in ${walletOwner} wallet.`
            };
        }
        if (foundPack.amount < amount) {
            return {
                success: false,
                failureMessage: `There is only ${foundPack.amount} ${foundPack.displayName} of the desired ${amount} in ${walletOwner} wallet.`
            };
        }
        if (finalPacks.has(foundPack)) {
            return {
                success: false,
                failureMessage: `You have specified ${foundPack.displayName} multiple times for ${walletOwner} wallet. Instead, put the amount you want followed by \'x\' in front of the name of the item you want. For example, \`3x98pele\` will pick the 98 Pelé card 3 times.`
            };
        }
        finalPacks.add({
            displayName: foundPack.displayName,
            amount,
            id: foundPack.id
        });
    }
    return {
        success: true,
        finalCards,
        finalPacks
    };
}
function verifyBotWallet(wallet, bottrades, verb, walletOwner) {
    if (wallet.bottrades < bottrades) {
        return {
            success: false,
            failureMessage: `The amount of bot trades you want to ${verb} (${formatNum(bottrades)}) is larger than the amount of bot trades in ${walletOwner} wallet (${formatNum(wallet.bottrades)}).`
        };
    }
    return {
        success: true
    };
}
function verifyCoins(coins, min, max, verb) {
    if (coins < min) {
        return `You cannot ${verb} less than ${formatNum(min)} coins.`;
    }
    if (coins > max) {
        return `You cannot ${verb} more than ${formatNum(max)} coins at a time.`;
    }
    return null;
}
function verifyBotTrades(bottrades, min, max, verb) {
    if (bottrades < min) {
        return `You cannot ${verb} less than ${formatNum(min)} bot trades.`;
    }
    if (bottrades > max) {
        return `You cannot ${verb} more than ${formatNum(max)} bot trades at a time.`;
    }
    return null;
}

// Création d'une structure pour stocker les réclamations
const claimedUsers = {};

bot.on("claimJoin", async (interaction) => {
    await interaction.acknowledge();
    const userId = interaction.member.id;
    
    // Vérification si l'utilisateur a déjà réclamé ses récompenses
    if (!claimedUsers[userId]) {
        const check2 = await db.getMadfutUserByDiscordUser(userId);
        console.log(check2);

        if (!check2) {
            const randomUsername = generateString(10);
            await db.setMadfutUserByDiscordUser(userId, randomUsername, randomUsername);
            await interaction.createFollowup({
                embeds: [
                    {
                        color: 16733527,
                        title: `No Madfut Account Linked! | Autolinked!`,
                        description: `Claiming rewards!\nWe autolinked your account to ${randomUsername}`
                    }
                ]
            });
        }

        await db.addBotTrades(userId, 5);
        claimedUsers[userId] = true; // Marquer l'utilisateur comme ayant réclamé
        interaction.createFollowup({
            embeds: [
                {
                    color: 16733527,
                    title: ".gg/madfut24 | Join Rewards",
                    description: "You have claimed your join rewards!",
                    thumbnail: {
                        url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                    },
                    image: {
                        url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                    }
                }
            ]
        });        
    } else {
        interaction.createFollowup({
            embeds: [
                {
                    color: 16733527,
                    title: ".gg/madfut24 | Join Rewards",
                    description: "You have already claimed your join rewards!\nIf this is a mistake then DM <@913175461989875753>",
                    thumbnail: {
                        url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                    },
                    image: {
                        url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                    }
                }
            ]
        });
        
        return;
    }
});

bot.on("resetJoin", async (interaction, user) => {
    await interaction.acknowledge();

    // Vérification si l'utilisateur a déjà réclamé ses récompenses
    if (claimedUsers[user]) {
        delete claimedUsers[user]; // Supprimer l'utilisateur de la liste des réclamations
        interaction.createFollowup({
            embeds: [
                {
                    color: 3319890,
                    title: `Reset Complete`,
                    description: `I have reset <@${user}> join rewards. They can now use the command again!`
                }
            ]
        });
    } else {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    title: `User Not Claimed`,
                    description: "This user has not claimed their join rewards!"
                }
            ]
        });
    }
});

bot.on("shop-buy", async (interaction, item) => {
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const username = await db.getMadfutUserByDiscordUser(userId);

    if (!username) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    title: `Not Linked!`,
                    description: "Cannot use shop because you are not linked!"
                }
            ]
        });
        return;
    }

    if (item == '15_bt') {
        let wallet = await db.getWallet(userId);
        if (wallet.coins < 100000000) {
            let needCoins = 100000000 - wallet.coins;
            let realCoins = needCoins.toLocaleString('en-US')
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        title: `Not enough money!`,
                        description: `You need more <:coins:1209800014088642631> \`${realCoins}\` to pay for this`
                    },
                ],
                flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
        } else {
            db.addCoins(userId, -100000000);
            db.addBotTrades(userId, 15);
            interaction.createFollowup({
                embeds: [
                    {
                        color: 3066993,
                        description: `<:Bot:1209800046716133376> \`15 Bots Trades\``
                    },
                ],
            });
            return;
        };
    };

    if (item == '30_bt') {
        let wallet = await db.getWallet(userId);
        if (wallet.coins < 175000000) {
            let needCoins = 175000000 - wallet.coins;
            let realCoins = needCoins.toLocaleString('en-US')
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        title: `Not enough money!`,
                        description: `You need more <:coins:1209800014088642631> \`${realCoins}\` to pay for this`
                    },
                ],
                flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
        } else {
            db.addCoins(userId, -175000000);
            db.addBotTrades(userId, 30);
            interaction.createFollowup({
                embeds: [
                    {
                        color: 3066993,
                        description: `You have claimed the <:Bot:1209800046716133376> \`30 Bots Trades\``
                    },
                ],
            });
            return;
        };
    };
});


const cooldowns = new Map();

bot.on("dailyspin", async (interaction) => {
    const userId = interaction.member.id;
    const now = Date.now();
    const cooldownTime = 24 * 60 * 60 * 1000;

    if (cooldowns.has(userId)) {
        const lastSpinTime = cooldowns.get(userId);

        if (now - lastSpinTime < cooldownTime) {
            const remainingTime = cooldownTime - (now - lastSpinTime);
            const hours = Math.floor(remainingTime / 3600000);
            const minutes = Math.floor((remainingTime % 3600000) / 60000);

            interaction.createMessage({
                embeds: [
                    {
                        color: 15158332,
                        description: `You still have a cooldown for ${hours} hours and ${minutes} minutes.`,
                    },
                ],
            });
            return;
        }
    }

    const username = await db.getMadfutUserByDiscordUser(userId);
    const stResult = db.startTransaction(userId);
    
    if (!stResult.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    title: `${username} You cannot spin because ${stResult.error}.`,
                    description: "try ... /mf force-end-transaction-me",
                },
            ],
        });
        return;
    }

    try {
        await interaction.acknowledge();
        const linked = await db.getMadfutUserByDiscordUser(userId);

        if (!linked) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description:
                            "There is no MADFUT account linked to your Discord account, so you cannot use your Daily Spin. To link one, use `/mf link <username>`.",
                    },
                ],
            });
            return;
        } else {
                const rewards = [
                    "10 MILLION COINS",
                    "5 MILLION COINS",
                    "1 MILLION COINS",
                    "2 BOT TRADES",
                    "4 BOT TRADES",
                    "6 BOT TRADES"
                ];
                const rewardsName = Math.floor(Math.random() * rewards.length);
    
    
    
                if (rewardsName === 0) await db.addCoins(userId, 10000000); // pay 80m coins
                else if (rewardsName === 1) await db.addCoins(userId, 5000000); // pay 100m coins
                else if (rewardsName === 2) await db.addCoins(userId, 1000000); // pay 10m coins
                else if (rewardsName === 3) await db.addBotTrades(userId, 2); // pay 20 bot trades
                else if (rewardsName === 4) await db.addBotTrades(userId, 4); // pay 30 bot trades
                else if (rewardsName === 5) await db.addBotTrades(userId, 6); // pay 69 bot trades

            const transactions = [];
            await Promise.all(transactions);
            interaction.createFollowup({
                embeds: [
                    {
                        title: ".gg/madfut24 | Dailyspin",
                        color: 3319890,
                        description: `You won **${rewards[rewardsName]}**!`,
                        author: {
                            name: "Cooldown 24H",
                        },
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                        },
                        image: {
                            url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                        }
                    },
                ],
            });            
        }

        cooldowns.set(userId, now);

        setTimeout(() => {
            cooldowns.delete(userId);
        }, cooldownTime);
    } finally {
        db.endTransaction(userId);
    }
});

async function freetradev2(username, amount, interaction) {
    let tradeRef;
    let traderName;
    
    for(let i = 0; i < amount; i++){
        console.log(`${amount} free trades left for ${username}`)
        let madfutClient = await madfutclient();
        try {
            traderName = await madfutClient.returnUserInfo(username);
        } catch  {
            await madfutClient?.logout();
            return;
        }
        try {
            
            tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
            
        } catch  {
            
            tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
        }
        try {
            let b = await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                    giveCoins: 10000000,
                    givePacks: false
                })
            );
            console.log(b)
        } catch (_err) {
            await madfutClient?.logout();
            return;
        }
        await madfutClient.logout();
    }
}

async function claimbt(interaction, message, userId, username, bottrades, walletVerification) {
    const transactions1 = [];
    if (!walletVerification.success) {
        interaction.createFollowup(walletVerification.failureMessage);
        return;
    }
    
    let ftRunning = "2";
    let times = bottrades;
    let tradeRef;
    let traderName;
    
    for(let i = 0; i < times;){
        let cunt = await db.getBotTrades(userId);
        let madfutClient = await madfutclient();
        if (cunt == 0) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 1752220,
                        description: "You dont have enough bot trades in your wallet 🤓."
                    }
                ]
            });
            await madfutClient.logout();
        }
        if (ftRunning === "1") {
            return;
        }
        try {
            traderName = await madfutClient.returnUserInfo(username);
        } catch  {
            tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
        }
        try {
            
            tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
            
        } catch  {

            tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
        }
        try {
            let b = await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                    giveCoins: 10000000,
                    givePacks: false
                })
            );
            console.log(b)
            transactions1.push(db.removeBotTrades(userId, 1));
            times = times - 1;
            
            await bot.editMessage(interaction.channel.id, message.id, {
                embeds: [
                    {
                        color: 1752220,
                        title: `.gg/madfut24 | Claim bt`,
                        description: `Sending bot trades to ${username},\nYou have ${times} bot trades left.`,
                        thumbnail: {
                            url: 'https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466'
                        },
                        image: {
                            url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                        }
                    }
                ]
        });
        } catch (_err) {
            await madfutClient?.logout();
            return;
        }
        await madfutClient.logout();
    }
}
const participants = new Set(); // Ensemble pour stocker les participants au giveaway
let giveawayActive = false; // Indique si un giveaway est actif

bot.on("messageCreate", async (message) => {
    // Vérifie si l'utilisateur a la permission de lancer un giveaway
    if (message.content.toLowerCase() === '!commencergiveaway' && message.member.permissions.has('ADMINISTRATOR')) {
        if (!giveawayActive) {
            giveawayActive = true;
            participants.clear(); // Efface la liste des participants
            message.channel.send('Le giveaway commence ! Pour participer, réagissez à ce message.');

            // Ajoute une réaction au message pour que les utilisateurs puissent participer
            const giveawayMessage = await message.channel.send('Cliquez sur la réaction pour participer.');
            giveawayMessage.react('🎉');
        } else {
            message.channel.send('Un giveaway est déjà en cours !');
        }
    }
});
bot.on("free-coins", async (interaction) => {
    const userId = interaction.member.id;
    const now = Date.now();
    const cooldownTime = 12 * 60 * 60 * 1000;

    if (cooldowns.has(userId)) {
        const lastSpinTime = cooldowns.get(userId);

        if (now - lastSpinTime < cooldownTime) {
            const remainingTime = cooldownTime - (now - lastSpinTime);
            const hours = Math.floor(remainingTime / 3600000);
            const minutes = Math.floor((remainingTime % 3600000) / 60000);

            interaction.createMessage({
                embeds: [
                    {
                        color: 15158332,
                        description: `You still have a cooldown for ${hours} hours and ${minutes} minutes.`,
                    },
                ],
            });
            return;
        }
    }

    const username = await db.getMadfutUserByDiscordUser(userId);
    const stResult = db.startTransaction(userId);
    
    if (!stResult.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    title: `${username} You cannot spin because ${stResult.error}.`,
                    description: "try ... /mf force-end-transaction-me",
                },
            ],
        });
        return;
    }

    try {
        await interaction.acknowledge();
        const linked = await db.getMadfutUserByDiscordUser(userId);

        if (!linked) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description:
                            "There is no MADFUT account linked to your Discord account, so you cannot use your Daily Spin. To link one, use `/mf link <username>`.",
                    },
                ],
            });
            return;
        } else {
                const rewards = [
                    "10 MILLION COINS",
                ];
                const rewardsName = Math.floor(Math.random() * rewards.length);
    
    
    
                if (rewardsName === 0) await db.addCoins(userId, 10000000); // pay 80m coins

            const transactions = [];
            await Promise.all(transactions);
            interaction.createFollowup({
                embeds: [
                    {
                        title: ".gg/madfut24 | Free Coins",
                        color: 3319890,
                        description: `You won **${rewards[rewardsName]}**!`,
                        author: {
                            name: "Cooldown 24H",
                        },
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                        },
                        image: {
                            url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                        }
                    }
                ]
            });            
        }

        cooldowns.set(userId, now);

        setTimeout(() => {
            cooldowns.delete(userId);
        }, cooldownTime);
    } finally {
        db.endTransaction(userId);
    }
});
bot.on("morpion", async (interaction) => {
    const board = Array.from(Array(3), () => new Array(3).fill(' '));
    let currentPlayer = 'X';

    const initialMessage = await interaction.followUp(`${interaction.user}, cliquez sur une case pour placer votre marque !`);
    const components = createButtons();

    await initialMessage.editReply({ content: 'Le jeu de Morpions commence !', components });

    const filter = i => i.customId.startsWith('morpion_') && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async interaction => {
        const [row, col] = interaction.customId.split('_')[1];
        if (board[row][col] === ' ') {
            board[row][col] = currentPlayer;
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            const newComponents = createButtons();
            await interaction.update({ content: displayBoard(), components: newComponents });
        }
        // Logique pour vérifier s'il y a un gagnant ou match nul
    });

    collector.on('end', collected => {
        if (collected.size === 0) {
            // Logique pour gérer le cas où aucun mouvement n'a été effectué avant la fin du collecteur
        }
    });
});

function createButtons() {
    const buttons = [];
    for (let i = 0; i < 3; i++) {
        const rowButtons = [];
        for (let j = 0; j < 3; j++) {
            rowButtons.push(
                new MessageButton()
                    .setCustomId(`morpion_${i}_${j}`)
                    .setLabel(board[i][j])
                    .setStyle('PRIMARY')
                    .setDisabled(board[i][j] !== ' ')
            );
        }
        buttons.push(new MessageActionRow().addComponents(...rowButtons));
    }
    return buttons;
}

function displayBoard() {
    let display = '```\n';
    display += ` ${board[0].join(' | ')} \n`;
    display += '-----------\n';
    display += ` ${board[1].join(' | ')} \n`;
    display += '-----------\n';
    display += ` ${board[2].join(' | ')} \n`;
    display += '```';
    return display;
}


bot.on("claim-bt", async (interaction, bottrades, type)=>{
    
    const userId = interaction.member.id;
    const username = await db.getMadfutUserByDiscordUser(userId);
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createMessage(`${username}  You cannot withdraw because ${stResult.error}.`);
        return;
    }
    try {
        await interaction.acknowledge();
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup("There is no MADFUT username linked to your Discord account.❌ To link one, use `/madfut link <username>`.");
            return;
        }
        
       const wallet = await db.getWallet(userId);
       if (wallet.bottrades < bottrades) {
           await interaction.createMessage({
               embeds: [
                   {
                       color: 15548997,
                       description: "Not enough bottrades❌"
                   }
               ],

           });
           return;
       }
       if (bottrades < 0) {
        await interaction.createMessage({
            embeds: [
                {
                    color: 15548997,
                    description: "You can't claim a negative amount of bot trades.",
                    thumbnail: {
                        url: 'https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466'
                    },
                    image: {
                        url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                    }
                }
            ],
        });
        return;
       }
       let message = await interaction.createMessage({
        embeds: [
            {
                color: 3447003,
                description: `Initiating bot trades for  ${username},\nYou have ${bottrades} bot trades left. `,
                thumbnail: {
                        url: 'https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466'
                    },
                    image: {
                        url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
               }
            }
        ]
    });
            await claimbt(interaction, message, userId, username, bottrades, verifyBotWallet(wallet, bottrades, "withdraw", "your"));
    } finally{
        db.endTransaction(userId);
    }
});

console.log("Madfut Client Logged In .gg/madfut24");
bot.on("suggest", async (interaction, suggestion)=> {

    const mfu = await db.getMadfutUserByDiscordUser(interaction.member.id);
    
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: `✅ Suggestion has been received and has been sent to the owner for reviewing!`
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    const botMessage = await bot.sendMessage(config.suggestionChannelId, {
        embeds: [
            {
                color: 0x00008B,
                footer: {
                    text: `Nouvelle suggestion de ${interaction.member.username} !`
                },
                title: `.gg/madfut24 | Suggestion`,
                description: `Suggestion de **<@${interaction.member.id}>** :\n${suggestion}`,
                thumbnail: {
                    url: 'https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466'
                },
                image: {
                    url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                }
            }
        ]
    });
    await bot.react(message, "✅"); 
    await bot.react(message, "❌"); 
})
bot.on("end-transaction-me", (interaction)=>{
    db.endTransaction(interaction.member.id);
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: `✅ Successfully force-ended all transactions`
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} force-ended the transactions`);
});

bot.on("link", async (interaction, username)=>{
    let userId = interaction.member.id;
    const username1 = await db.getMadfutUserByDiscordUser(userId);
    let traderrr = `madfut24`;
    await interaction.createMessage({
        embeds: [
            {
                title: `.gg/madfut24 | Linking`,
                color: 16711680,
                description: `A verification invite with the username .gg/madfut24 has been sent to \`${username}\` on MADFUT.\nAccept it within 1 minute to link your MADFUT account to your Discord account.`,
                thumbnail: {
                    url: `https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466`,
                },
                image: {
                    url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                }
            }
        ]
    });
    const madfutUsername = username.toLowerCase();
    let madfutClient = await madfutclient();
    let trade;
    try {
        const traderName = await madfutClient.returnUserInfo(madfutUsername);
        console.log('Invite user ' + username);
        console.log(traderName + "   EZEDSQLJKQSDJKNQSDJKNLDSQJKNSQDJKN")
        
        trade = await madfutClient.inviteUser(traderName, traderrr);
        //console.log(traderName + "\n\n\nEZ")
        let x;
        try {
            let b = await madfutClient.doTrade(trade, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: profile[ProfileProperty.wishList]?.slice(0, 0) ?? [],
                    giveCoins: 10000,
                    givePacks: [],
                })
            );
            //console.log(b)
            await madfutClient.logout();
        } catch (err) {
            trade = await madfutClient.inviteUser(traderName, traderrr);
            console.log("LINK ERROR:", err)
            return;
        }
        // await db.setMadfutUserByDiscordUser(interaction.member!.id, madfutUsername, traderName); 
        if (await db.setMadfutUserByDiscordUser(interaction.member.id, madfutUsername, traderName)) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15548997,
                        title: ".gg/madfut24 | Linking",
                        description: `Your madfut account \`${username}\` has been linked to <@${interaction.member.id}>`,
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                        },
                        image: {
                            url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                        }
                    }
                ]
            });            
        } else {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15548997,
                        title: ".gg/madfut24 | Linking Failure",
                        description: "Failed to link to your account; you already have an account linked to your Discord. Please use `/unlink` to unlink the current account.",
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                        },
                        image: {
                            url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                        }
                    }
                ]
            });            
        }
    } catch (err) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15548997,
                    title: ".gg/madfut24 | Account Linking Failure",
                    description: "Linking your MADFUT account to your Discord account has failed. You declined the invite on MADFUT or didn't accept it within 1 minute.",
                    thumbnail: {
                        url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                    },
                    image: {
                        url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                    }
                }
            ]
        });        
    }
});
async function freebies(username, amount) {
    console.log(`sent freebies ${username} ${amount} trades`);
    let ftRunning = "2";
    let times = amount;
    intervalfuncft();
    let count = 0;
    async function intervalfuncft() {
        let madfutClient;
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
                console.log(`${username} accepted invite  MAIN.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${username} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: false
                    })
                );
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
let amount3 = 0;

async function freeTradeUnlimited2(username, coins, cards) {
    while(true){
        let madfutClient = await madfutclient();
        let tradeRef;
        try {
            tradeRef = await madfutClient.inviteUser(username, `madfut24`);
            console.log(`${username} accepted invite.`);
        } catch  {
            console.log(`${username} rejected invite or timed out.`);
            break;
        }
        try {
            await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    receiveCards: false,
                    receivePacks: false,
                    giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                    giveCoins: 10000000,
                    givePacks: false
                })
            );
            console.log(`Completed unlimited trade with ${username}`);
            amount1++;
            await madfutClient.logout();
            console.log("switched");
        } catch (_err) {
            console.log(`Unlimited trade with ${username} failed: Player left`);
            await madfutClient.logout();
        }
    }
}

bot.on("viewlink", async (interaction)=>{
    await interaction.acknowledge();
    const username = await db.getMadfutUserByDiscordUser(interaction.member.id);
    if (username) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15548997,
                    title: `${username}`,
                    description: "The MADFUT username is linked to your Discord account."
                }
            ]
        });
    } else {
        interaction.createFollowup({
                embeds: [
                    {
                        color: 15548997,
                        title: ".gg/madfut24 | Account Linking Error",
                        description: "There is no MADFUT username linked to your Discord account. If you want to link one, use `/madfut link <username>`.",
                        thumbnail: {
                            url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                        },
                        image: {
                            url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                        }
                    }
                ]
            });      
    }
});

bot.on("unlink", async (interaction)=>{
    await db.setMadfutUserByDiscordUser(interaction.member.id, null, "");
    await interaction.editParent({
        embeds: [
            {
                color: 15548997,
                title: ".gg/madfut24 | Unlink",
                description: "Your MADFUT account has been successfully unlinked from your Discord account."
            }
        ],
        components: []
    });
});
bot.on("updatenames", async (interaction, names)=>{
    await db.updateMappings(names);
    interaction.createFollowup({
        embeds: [
            {
                color: 15548997,
                description: "```Mappings successfully updated!```"
            }
        ]
    });
});

bot.on("wallet", async (interaction, userId, page)=>{
    if (page <= 0) {
        await interaction.createMessage({
            embeds: [
                {
                    color: 15548997,
                    description: "```The page in your wallet you want to view cannot be smaller than 1.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    await interaction.acknowledge();
    const wallet = await db.getWallet(userId, page);
    const numPages = Math.max(1, Math.ceil(wallet.count / 50));
    if (page > numPages) {
        interaction.editOriginalMessage({
            embeds: [
                {
                    color: 15548997,
                    description: `You cannot view page ${page} because your wallet only has ${numPages} page${numPages === 1 ? "" : "s"}.`
                }
            ]
        });
        return;
    }
const walletFields = [
        {
            name: "<:COIN:1130175589840584834> ```Coins``` ",
            value: `You currently have  **${formatNum(wallet.coins)} Coins**.`
        },
        {
            name: "<:9435blurplebot:1215791821783957504> ```Bot Trades```",
            value: `You currently have **${formatNum(wallet.bottrades)} Bot Trades**.`
        },
    ];
    if (wallet.cards.length === 0) {
        walletFields.push({
            name: "<:card:1130175661814841344> ```Cards```",
            value: "```You have no cards.```",
            inline: true
        });
    } else {
        let latestField = {
            name: "<:card:1130175661814841344> ```Cards```",
            value: "",
            inline: true
        };
        let first = true;
        for (const card of wallet.cards){
            let cardString = `${first ? "" : "\n"}${card.amount}x **${card.displayName}**`;
            if (latestField.value.length + cardString.length > 1024) {
                walletFields.push(latestField);
                latestField = {
                    name: "<:card:1130175661814841344> ```Cards (cont.)```",
                    value: ``,
                    inline: true
                };
                cardString = `${card.amount}x **${card.displayName}**`;
            }
            latestField.value += cardString;
            first = false;
        }
        walletFields.push(latestField);
    } 
if (wallet.packs.length === 0) {
    }
    interaction.editOriginalMessage({
        embeds: [
            {
                color: 0xD8BFD8,
                thumbnail: {
                    url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                },
                image: {
                    url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                },
                description: `**Showing <@!${userId}> Madfut 24 Wallet:**`,
                fields: walletFields
            }
        ]
    });
});

bot.on("deposit", async (interaction, multiple)=>{
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const username = await db.getMadfutUserByDiscordUser(userId);
    if (!username) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15548997,
                    title: ".gg/madfut24 | Deposit",
                    description: "Cannot deposit as there is no MADFUT username linked to your Discord account. To link MADFUT account, use /madfut link <username>.",
                    thumbnail: {
                        url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                    },
                    image: {
                        url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                    }
                }
            ]
        });
        return;
    }
    if (!multiple) {
        interaction.editOriginalMessage({
            embeds: [
                {
                    color: 15548997,
                    title: ".gg/madfut24 | Deposit",
                    description: `Your MADFUT account has been inAn invitation for deposit has been sent to the MADFUT 24 user named **${username}**!\n• To proceed, you must accept the invitation and complete the trade to finish the deposit process!\n• Invite Will Expire In 1 Minute If No Interaction!`,
                    thumbnail: {
                        url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                    },
                    image: {
                        url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                    }
                }
            ]
        });
    }    
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15548997,
                    title: `${username} | Deposit Error`,
                    description: `You cannot deposit because ${stResult.error}. Use /mf force-end-transaction-me.`,
                    thumbnail: {
                        url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                    },
                    image: {
                        url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                    }
                }
            ]
        });        
        return;
    }
    interaction.editOriginalMessage({
        embeds: [
            {
                color: 15548997,
                title: `.gg/madfut24 | Multiple Deposit`,
                description: `Multi-deposit has started for the MADFUT 24 user named **${username}!**\n• To proceed, you must accept the invitation and complete the trade to finish the deposit process!\n• Invite Will Expire In 1 Minute If No Interaction!`,
                thumbnail: {
                    url: 'https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=935&height=935',
                },
                image: {
                    url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                }
            }
        ]
    });      
    try {
        do {
            let tradeRef;
            let madfutClient = await madfutclient();
            try {
                const traderName = await madfutClient.returnUserInfo(username);
                tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
            } catch (err) {
                if (multiple) {
                    interaction.editOriginalMessage({
                        embeds: [
                            {
                                color: 15548997,
                                title: `${username}`,
                                description: "You failed to accept the invite in time.",
                                thumbnail: {
                                    url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466",
                                },
                                image: {
                                    url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                                }
                            }
                        ]
                    });
                }                
                return;
            }
            let tradeResult;
            try {
                tradeResult = await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: true,
                        giveCoins: 0,
                        givePacks: [],
                        receivePacks: true,
                        giveCards: [],
                        receiveCards: true
                    })
                );
                const transactions = [];
                if (tradeResult.netCoins > 10000000) {
                    const wallet = await db.getWallet(userId);
                    transactions.push(db.addCoins(userId, -tradeResult.netCoins));
                    transactions.push(db.addCoins(userId, -wallet.coins));
                    transactions.push(db.addBotTrades(userId, -wallet.bottrades));
                    for (const card of wallet.cards){
                        transactions.push(db.addCards(userId, card.id, -card.amount));
                    }
                    for (const pack of wallet.packs){
                        transactions.push(db.addPacks(userId, pack.id, -pack.amount));
                    }
                    await Promise.all(transactions);
                } else {
                    let coinsAdd = 0;
                    let cardsAdd = "null";
                    let packsAdd = "null";
                    transactions.push(db.addCoins(userId, tradeResult.netCoins));
                    coinsAdd = tradeResult.netCoins;
                    for (const cardId of tradeResult.receivedCards){
                        transactions.push(db.addCards(userId, cardId, 1));
                        if (cardsAdd === "null") {
                            cardsAdd = cardId;
                        } else {
                            cardsAdd += `|${cardId}`;
                        }
                    }
                    for(const packId in tradeResult.receivedPacks){
                        if (tradeResult.receivedPacks[packId] > 20) {
                            const wallet = await db.getWallet(userId);
                            transactions.push(db.addCoins(userId, -tradeResult.netCoins));
                            transactions.push(db.addCoins(userId, -wallet.coins));
                            transactions.push(db.addBotTrades(userId, -wallet.bottrades));
                            for (const card of wallet.cards){
                                transactions.push(db.addCards(userId, card.id, -card.amount));
                            }
                            for (const pack of wallet.packs){
                                transactions.push(db.addPacks(userId, pack.id, -pack.amount));
                            }
                            await Promise.all(transactions);
                            interaction.createFollowup({
                                embeds: [
                                    {
                                        color: 15158332,
                                        title: `${username}`,
                                        description: "CHEATER"
                                    }
                                ]
                            });

                        } else {
                            transactions.push(db.addPacks(userId, packId, tradeResult.receivedPacks[packId]));
                        }
                        if (packsAdd === "null") {
                            packsAdd = `${tradeResult.receivedPacks[packId]}x ${packId}`;
                        } else {
                            packsAdd += `|${tradeResult.receivedPacks[packId]}x ${packId}`;
                        }
                    }
                    if (!multiple) {
                        interaction.createFollowup({
                            embeds: [
                                {
                                    color: 15548997,
                                    title: `${username}`,
                                    description: " ✅ Your deposit was successful!"
                                }
                            ]
                        });
                    }
                    await Promise.all(transactions);
                }
            } catch (err1) {
                if (multiple) interaction.createFollowup({
                    embeds: [
                        {
                            color: 15158332,
                            title: `${username}`,
                            description: "You left the trade."
                        }
                    ]
                });
                return;
            }
            await madfutClient.logout();
        }while (multiple)
    } finally{
        db.endTransaction(userId);
    }
});
async function withdraw(interaction, userId, username, coins, walletVerification) {
    let madfutClient = await madfutclient();
    if (!walletVerification.success) {
        interaction.createFollowup(walletVerification.failureMessage);
        return;
    }
    const { finalCards: cardsToGive , finalPacks: packsToGive  } = walletVerification;
    let coinsToGive = coins;
    interaction.createFollowup({
        embeds: [
            {
                color: 15548997,
                description: "✅ Withdraw successful started. If you want to exit the withdraw, decline, leave the trade, or wait 1 minute. This mode will also exit once you have received all the items you wanted to withdraw."
            }
        ]
    });
    while(coinsToGive > 0 || cardsToGive.size > 0 || packsToGive.size > 0){
        let tradeRef;
        let traderName;
        let userdead;
        try {
            traderName = await madfutClient.returnUserInfo(username);
        } catch (err) {
            return;
        }
        try {
            tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
        } catch  {
            db.endTransaction(userId);
        }
        const giveCoins = Math.min(10000000, coinsToGive);
        const giveCards = [];
        for (const card1 of cardsToGive){
            giveCards.push(card1);
            if (giveCards.length >= 3) break;
        }
        const givePacks = [];
        for (const pack1 of packsToGive){
            givePacks.push(pack1);
            if (givePacks.length >= 3) break;
        }
        try {
            const tradeResult = await madfutClient.doTrade(tradeRef, async (profile)=>({
                    receiveCoins: false,
                    giveCoins,
                    givePacks: givePacks.map((pack)=>({
                            pack: pack.id,
                            amount: 1
                        })
                    ),
                    receivePacks: false,
                    giveCards: giveCards.map((card)=>card.id
                    ),
                    receiveCards: false
                })
            );
            const transactions = [];
            let coinsWith = 0;
            let cardsWith = "null";
            let packsWith = "null";
            transactions.push(db.addCoins(userId, tradeResult.netCoins));
            coinsWith = tradeResult.netCoins;
            for (const cardId of tradeResult.givenCards){
                transactions.push(db.addCards(userId, cardId, -1));
                if (cardsWith === "null") {
                    cardsWith = cardId;
                } else {
                    cardsWith += `|${cardId}`;
                }
            }
            for(const packId in tradeResult.givenPacks){
                transactions.push(db.addPacks(userId, packId, -tradeResult.givenPacks[packId]));
                if (packsWith === "null") {
                    packsWith = `${tradeResult.givenPacks[packId]}x ${packId}`;
                } else {
                    packsWith += `|${tradeResult.givenPacks[packId]}x ${packId}`;
                }
            }
            await Promise.all(transactions);
            // logMessage("Withdraw", interaction.member!.id, coinsWith, cardsWith, packsWith);
            coinsToGive -= giveCoins;
            for (const cardId1 of tradeResult.givenCards){
                const card = cardsToGive.getById(cardId1);
                if (!card) return;
                card.amount--;
                if (card.amount <= 0) {
                    cardsToGive.delete(card);
                }
            }
            for(const packId1 in tradeResult.givenPacks){
                const pack = packsToGive.getById(packId1);
                if (!pack) return;
                pack.amount -= tradeResult.givenPacks[packId1];
                if (pack.amount <= 0) {
                    packsToGive.delete(pack);
                }
            }
        } catch  {
            console.log("dead");
            madfutClient.logout();
        }
    }
    await madfutClient?.logout();
}

bot.on("withdraw-all", async (interaction)=>{
    const userId = interaction.member.id;
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        const username = await db.getMadfutUserByDiscordUser(userId);
        interaction.createMessage({
            embeds: [
                {
                    color: 15548997,
                    title: ` ${username}  You cannot withdraw because ${stResult.error}.`,
                    description: "`Use ```/mf force-end-trasaction-me```"
                }
            ]
        });
        return;
    }
    try {
        await interaction.acknowledge();
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "Cannot withdraw as there is no MADFUT username linked to your Discord account. To link one, use /mf link <username>."
                    }
                ]
            });
            return;
        }
        const wallet = await db.getWallet(userId);
        if (wallet.coins <= 0 && wallet.cards.length === 0 && wallet.packs.length === 0) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15548997,
                        description: "❌ You cannot enter withdraw-all mode because your wallet is completely empty."
                    }
                ],
                flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
        }
        await withdraw(interaction, userId, username, wallet.coins, {
            success: true,
            finalCards: new ObjectSet(wallet.cards),
            finalPacks: new ObjectSet(wallet.packs)
        });
    } finally{
        db.endTransaction(userId);
    }
});
bot.on("withdraw", async (interaction, coins, cards, packs)=>{
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "withdraw");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    const userId = interaction.member.id;
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createMessage(`You cannot withdraw because ${stResult.error}.`);
        return;
    }
    try {
        await interaction.acknowledge();
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup("Cannot withdraw as there is no MADFUT username linked to your Discord account. To link one, use `/madfut link <username>`.");
            return;
        }
        const wallet = await db.getWallet(userId);
        await withdraw(interaction, userId, username, coins, verifyWallet(wallet, coins, cards, packs, "withdraw", "your"));
    } finally{
        db.endTransaction(userId);
    }
});

const moneyChannels = [
    config.commandsChannelId,
    config.tradingChannelId
];
const Adminchannel = [
    config.adminChannelId,
    config.commandsChannelId,
    config.tradingChannelId
];
const moneyChannelsMention = `<#${moneyChannels[0]}> or <#${moneyChannels[1]}>`;
//level command

let matchStartTimeout;
let matchMessage;
let invitemessage;
bot.on("invite", async (interaction, amount, packs, username, coins)=>{
    if (packs.length > 3) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: "```❌ You can't pick more than 3 packs.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    const usernameMe = await db.getMadfutUserByDiscordUser(interaction.member.id);
    if (!usernameMe) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: "```❌ You have not linked your Madfut account.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    // const stResult = db.startTransaction(interaction.member!.id);
    //     if (!stResult.success) {
    //     interaction.createMessage({embeds: [
    //         {
    //             color: 15158332,
    //             description: "❌ You have a ongoing transaction."
    //         }
    //     ],
    //     flags: Constants.MessageFlags.EPHEMERAL
    // });
    //     return;
    // }
    const invatation = await interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                title: `${username}`,
                description: "You have been invited on madfut. Accept the invite and do the trade. After the acception you have to click on the button if the pack was correct or wrong.\nYou have 1 minute to accept the trade, otherwise you have to do the command again."
            }
        ]
    });
 
    freetradepacks(interaction, username, amount, coins, packs ? packs.map((pack)=>({
            pack,
            amount: 1
        })
    ) : packs);
//}
});
bot.on("end-transaction", (interaction, userId)=>{
    db.endTransaction(userId);
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                title: `<@${userId}>`,
                description: "✅ Successfully force-ended all transactions"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} force-ended the transactions from ${userId}`);
});
bot.on("pay", async (interaction, otherUserId, coins, cards, packs, bottrades)=>{
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    const botTradesError = verifyBotTrades(bottrades, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (botTradesError) {
        interaction.createMessage(botTradesError);
        return;
    }
    const userId = interaction.member.id;
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    title: ` ${userId} You cannot pay because ${stResult.error}.`,
                    description: "."
                }
            ]
        });
        return;
    }
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "The user you want to pay have a ongoing transaction."
                }
            ]
        });
        db.endTransaction(userId);
        return;
    }
    try {
        await interaction.acknowledge();
        const wallet = await db.getWallet(userId);
        const walletVerification = verifyWallet(wallet, coins, cards, packs, "pay", "your");
        const botWalletVerification = verifyBotWallet(wallet, bottrades, "pay", "your");
        if (!walletVerification.success) {
            interaction.editOriginalMessage(walletVerification.failureMessage);
            return;
        }
        if (!botWalletVerification.success) {
            interaction.editOriginalMessage(botWalletVerification.failureMessage);
            return;
        }
        const { finalCards , finalPacks  } = walletVerification;
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "There is no MADFUT account linked to your Discord account so you cannot pay. To link one, use `/madfut link <username>`."
                    }
                ]
            });
            return;
        }
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "The user you want to pay have not linked their MADFUT account to his Discord account so you can't pay him. To link one, use `/madfut link <username>`."
                    }
                ]
            });
            return;
        }
        const transactions = [];
        transactions.push(db.removeBotTrades(userId, bottrades));
        transactions.push(db.addBotTrades(otherUserId, bottrades));
        transactions.push(db.addCoins(userId, -coins));
        transactions.push(db.addCoins(otherUserId, coins));
        for (const card of finalCards){
            transactions.push(db.addCards(otherUserId, card.id, card.amount));
            transactions.push(db.addCards(userId, card.id, -card.amount));
        }
        for (const pack of finalPacks){
            transactions.push(db.addPacks(otherUserId, pack.id, pack.amount));
            transactions.push(db.addPacks(userId, pack.id, -pack.amount));
        }
        await Promise.all(transactions);
    } finally{
        db.endTransaction(userId);
        db.endTransaction(otherUserId);
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                description: `✅ Your payment to <@${otherUserId}> was successful.`
            }
        ]
    });
});
bot.on("admin-pay", async (interaction, otherUserId, coins, cards, packs, bottrades)=>{
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    const botTradesError = verifyBotTrades(bottrades, 0, Number.MAX_SAFE_INTEGER, "pay");
    if (botTradesError) {
        interaction.createMessage(botTradesError);
        return;
    }
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "The user you want to pay have a ongoing transaction, so you can't pay him right now."
                }
            ]
        });
        return;
    }
    try {
        await interaction.acknowledge();
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "The user you want to pay have not linked their MADFUT account to his Discord account so you can't pay him. To link one, use `/madfut link <username>`."
                    }
                ]
            });
            return;
        }
        const transactions = [];
        transactions.push(db.addCoins(otherUserId, coins));
        transactions.push(db.addBotTrades(otherUserId, bottrades));
        for (const card of cards){
            const [cardId, cardAmount] = extractAmount(card);
            transactions.push(db.addCards(otherUserId, cardId, cardAmount));
        }
        for (const pack of packs){
            const [packId, packAmount] = extractAmount(pack);
            transactions.push(db.addPacks(otherUserId, packId, packAmount));
        }
        await Promise.all(transactions);
    } finally{
        db.endTransaction(otherUserId);
    }
    const username = await db.getMadfutUserByDiscordUser(otherUserId);
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                title: `Your admin payment was sent to ${username}`,
                description: "✅ Your admin payment was successful ✅"
            }
        ]
    });
});
bot.on("remove", async (interaction, otherUserId, coins, cards, packs, bottrades)=>{
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "The user you want to remove items from have a ongoing transaction, so you can't remove items from him right now."
                }
            ]
        });
        return;
    }
    try {
        await interaction.acknowledge();
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: "The user you want to remove items from have not linked their MADFUT account to his Discord account so you can't remove items from him. To link one, use `/madfut link <username>`."
                    }
                ]
            });
            return;
        }
        const wallet = await db.getWallet(otherUserId);
        const walletVerification = verifyWallet(wallet, coins, cards, packs, "remove", "the other user's");
        const botWalletVerification = verifyBotWallet(wallet, bottrades, "remove", "the other user's");
        if (!walletVerification.success) {
            interaction.editOriginalMessage(walletVerification.failureMessage);
            return;
        }
        if (!botWalletVerification.success) {
            interaction.editOriginalMessage(botWalletVerification.failureMessage);
            return;
        }
        const { finalCards , finalPacks  } = walletVerification;
        const transactions = [];
        transactions.push(db.addCoins(otherUserId, -wallet.coins));
        transactions.push(db.addBotTrades(otherUserId, -wallet.bottrades));
        for (const card of wallet.cards){
            transactions.push(db.addCards(otherUserId, card.id, -card.amount));
        }
        for (const pack of wallet.packs){
            transactions.push(db.addPacks(otherUserId, pack.id, -pack.amount));
        }
        await Promise.all(transactions);
    } finally{
        db.endTransaction(otherUserId);
    }
    const username = await db.getMadfutUserByDiscordUser(otherUserId);
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                title: `Admin remove from  ${username}`,
                description: "✅ removed all users items ✅"
            }
        ]
    });
});
bot.on("trade", async (interaction, otherUserId, givingCoins, givingCards, givingPacks, givingBotTrades, receivingCoins, receivingCards, receivingPacks, receivingBotTrades)=>{
    let coinsError = verifyCoins(givingCoins, 0, Number.MAX_SAFE_INTEGER, "give");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    coinsError = verifyCoins(receivingCoins, 0, Number.MAX_SAFE_INTEGER, "receive");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    let botTradesError = verifyBotTrades(givingBotTrades, 0, Number.MAX_SAFE_INTEGER, "give");
    if (botTradesError) {
        interaction.createMessage(botTradesError);
        return;
    }
    botTradesError = verifyBotTrades(receivingBotTrades, 0, Number.MAX_SAFE_INTEGER, "receive");
    if (botTradesError) {
        interaction.createMessage(botTradesError);
        return;
    }
    if (givingCoins !== 0 && receivingCoins !== 0) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "You cannot both give and receive coins at the same time."
                }
            ]
        });
        return;
    }
    if (givingBotTrades !== 0 && receivingBotTrades !== 0) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15158332,
                    description: "You cannot both give and receive bot trades at the same time."
                }
            ]
        });
        return;
    }
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const myWallet = await db.getWallet(userId);
    const myWalletVerification = verifyWallet(myWallet, givingCoins, givingCards, givingPacks, "give", "your");
    const myBotWalletVerification = verifyBotWallet(myWallet, givingBotTrades, "give", "your");
    if (!myWalletVerification.success) {
        interaction.editOriginalMessage(myWalletVerification.failureMessage);
        return;
    }
    if (!myBotWalletVerification.success) {
        interaction.editOriginalMessage(myBotWalletVerification.failureMessage);
        return;
    }
    const { finalCards: myFinalCards , finalPacks: myFinalPacks  } = myWalletVerification;
    const otherWallet = await db.getWallet(otherUserId);
    const otherWalletVerification = verifyWallet(otherWallet, receivingCoins, receivingCards, receivingPacks, "receive", "the other user's");
    const otherBotWalletVerification = verifyBotWallet(otherWallet, receivingBotTrades, "receive", "the other user's");
    if (!otherWalletVerification.success) {
        interaction.editOriginalMessage(otherWalletVerification.failureMessage);
        return;
    }
    if (!otherBotWalletVerification.success) {
        interaction.editOriginalMessage(otherBotWalletVerification.failureMessage);
        return;
    }
    const { finalCards: otherFinalCards , finalPacks: otherFinalPacks  } = otherWalletVerification;
    const msg = {
        embeds: [
            {
                color: 3319890,
                author: {
                    name: "```Trade Request```",
                    icon_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Human-emblem-handshake.svg/240px-Human-emblem-handshake.svg.png"
                },
                description: `<@${otherUserId}>, <@${userId}> wants to trade with you. You have 1 minute to accept.`,
                fields: [
                    {
                        name: " <:sbc_coins:1005074107236356190> Coins",
                        value: `You will *${givingCoins === 0 ? "give* **" + formatNum(receivingCoins) : "receive* **" + formatNum(givingCoins)} coins**.`
                    },
                    {
                        name: "```Bot Trades```",
                        value: `You will *${givingBotTrades === 0 ? "give* **" + formatNum(receivingBotTrades) : "receive* **" + formatNum(givingBotTrades)} bot-trades**.`
                    },
                    {
                        name: "<:sbc_128:1048535781595172934> Cards you will receive",
                        value: myFinalCards.size === 0 ? "No cards." : myFinalCards.map((card)=>`${card.amount}x **${card.displayName}**`
                        ).join("\n")
                    },
                    {
                        name: "<:TOTS_PACK:983384447523115018>Packs you will receive",
                        value: myFinalPacks.size === 0 ? "No packs." : myFinalPacks.map((pack)=>`${pack.amount}x **${pack.displayName}**`
                        ).join("\n")
                    },
                    {
                        name: "<:sbc_128:1048535781595172934> Cards you will give",
                        value: otherFinalCards.size === 0 ? "No cards." : otherFinalCards.map((card)=>`${card.amount}x **${card.displayName}**`
                        ).join("\n")
                    },
                    {
                        name: "<:TOTS_PACK:983384447523115018>Packs you will give",
                        value: otherFinalPacks.size === 0 ? "No packs." : otherFinalPacks.map((pack)=>`${pack.amount}x **${pack.displayName}**`
                        ).join("\n")
                    }
                ]
            }
        ],
        components: [
            {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: [
                    {
                        custom_id: "trade-confirm",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.SUCCESS,
                        label: "Confirm"
                    },
                    {
                        custom_id: "trade-decline",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.DANGER,
                        label: "Decline"
                    }
                ]
            }
        ]
    };
    interaction.createMessage(msg);
    const messageId = (await interaction.getOriginalMessage()).id;
    bot.setPermittedReact(messageId, otherUserId);
    const result = await Promise.race([
        once(bot, "tradereact" + messageId),
        sleep(60000)
    ]);
    bot.removeAllListeners("tradereact" + messageId);
    msg.components = [];
    if (!result) {
        msg.embeds[0].footer = {
            text: "This trade request has expired."
        };
        interaction.editOriginalMessage(msg);
        return;
    }
    const [reactInteraction, reaction] = result;
    reactInteraction.acknowledge();
    if (!reaction) {
        msg.embeds[0].footer = {
            text: "This trade request has been declined."
        };
        interaction.editOriginalMessage(msg);
        return;
    }
    interaction.editOriginalMessage(msg);
    // trade request accepted
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createFollowup(stResult.globalError ? `You cannot trade because ${stResult.error}.` : `You cannot trade because <@${userId}> has an ongoing transaction.`);
        return;
    }
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createFollowup(stResult2.globalError ? `You cannot trade because ${stResult2.error}.` : `You cannot trade because <@${otherUserId}> has an ongoing transaction.`);
        db.endTransaction(userId);
        return;
    }
    try {
        const myWalletVerification2 = verifyWallet(await db.getWallet(userId), givingCoins, givingCards, givingPacks, "receive", `<@${userId}>'s`);
        const myBotWalletVerification2 = verifyBotWallet(await db.getWallet(userId), givingBotTrades, "receive", `<@${userId}>'s`); // TODO: name collisions could cause success even if the user doesn't have the original packs
        if (!myWalletVerification2.success) {
            interaction.createFollowup(myWalletVerification2.failureMessage);
            return;
        }
        if (!myBotWalletVerification2.success) {
            interaction.createFollowup(myBotWalletVerification2.failureMessage);
            return;
        }
        const otherWalletVerification2 = verifyWallet(await db.getWallet(otherUserId), receivingCoins, receivingCards, receivingPacks, "give", `<@${otherUserId}>'s`);
        const otherBotWalletVerification2 = verifyBotWallet(await db.getWallet(otherUserId), receivingBotTrades, "give", `<@${otherUserId}>'s`);
        if (!otherWalletVerification2.success) {
            interaction.createFollowup(otherWalletVerification2.failureMessage);
            return;
        }
        if (!otherBotWalletVerification2.success) {
            interaction.createFollowup(otherBotWalletVerification2.failureMessage);
            return;
        }
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `Trade failed as there is no MADFUT username linked to <@${userId}>'s Discord account. To link one, use \`/madfut link <username>\`.`
                    }
                ]
            });
            return;
        }
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `Trade failed as there is no MADFUT username linked to <@${otherUserId}>'s Discord account. To link one, use \`/madfut link <username>\`.`
                    }
                ]
            });
            return;
        }
        const transactions = [];
        transactions.push(db.addBotTrades(userId, receivingBotTrades - givingBotTrades));
        transactions.push(db.addBotTrades(otherUserId, givingBotTrades - receivingBotTrades));
        transactions.push(db.addCoins(userId, receivingCoins - givingCoins));
        transactions.push(db.addCoins(otherUserId, givingCoins - receivingCoins));
        for (const card of myFinalCards){
            transactions.push(db.addCards(otherUserId, card.id, card.amount));
            transactions.push(db.addCards(userId, card.id, -card.amount));
        }
        for (const card2 of otherFinalCards){
            transactions.push(db.addCards(userId, card2.id, card2.amount));
            transactions.push(db.addCards(otherUserId, card2.id, -card2.amount));
        }
        for (const pack of myFinalPacks){
            transactions.push(db.addPacks(otherUserId, pack.id, pack.amount));
            transactions.push(db.addPacks(userId, pack.id, -pack.amount));
        }
        for (const pack2 of otherFinalPacks){
            transactions.push(db.addPacks(userId, pack2.id, pack2.amount));
            transactions.push(db.addPacks(otherUserId, pack2.id, -pack2.amount));
        }
        await Promise.all(transactions);
    } finally{
        db.endTransaction(userId);
        db.endTransaction(otherUserId);
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 3319890,
                description: `✅ Trade between <@${userId}> and <@${otherUserId}> was successful.`
            }
        ]
    });
});
bot.on("flip", async (interaction, coins, heads, otherUserId)=>{
    const flipResult = getRandomInt(2) === 0;
    const iWin = flipResult === heads;
    const coinsError = verifyCoins(coins, 0, Number.MAX_SAFE_INTEGER, "flip for");
    if (coinsError) {
        interaction.createMessage(coinsError);
        return;
    }
    await interaction.acknowledge();
    const userId = interaction.member.id;
    const myWalletVerification = verifyWallet(await db.getWallet(userId), coins, [], [], "flip for", "your");
    if (!myWalletVerification.success) {
        interaction.editOriginalMessage(myWalletVerification.failureMessage);
        return;
    }
    const openFlip = !otherUserId;
    if (!openFlip) {
        const otherWalletVerification = verifyWallet(await db.getWallet(otherUserId), coins, [], [], "flip for", "the other user's");
        if (!otherWalletVerification.success) {
            interaction.editOriginalMessage(otherWalletVerification.failureMessage);
            return;
        }
    }
    const msg = {
        embeds: [
            {
                description: `${openFlip ? "Does anyone" : `<@${otherUserId}>, do you`} want to coin flip with <@${userId}> for **${formatNum(coins)} coins**? They chose **${heads ? "heads" : "tails"}**.`,
                color: 16114498,
                author: {
                    name: "Coin flip",
                    icon_url: "https://w7.pngwing.com/pngs/191/349/png-transparent-dogecoin-bitcoin-cryptocurrency-exchange-bitcoin-dog-like-mammal-meme-bitcoin.png"
                },
                footer: {
                    text: "You have 30 seconds to respond."
                }
            }
        ],
        components: [
            {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: openFlip ? [
                    {
                        custom_id: "flip-confirm",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.SUCCESS,
                        label: "Confirm"
                    }
                ] : [
                    {
                        custom_id: "flip-confirm",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.SUCCESS,
                        label: "Confirm"
                    },
                    {
                        custom_id: "flip-decline",
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.DANGER,
                        label: "Decline"
                    }
                ]
            }
        ]
    };
    interaction.createMessage(msg);
    const messageId = (await interaction.getOriginalMessage()).id;
    bot.setPermittedReact(messageId, otherUserId ?? true);
    const result = await Promise.race([
        once(bot, "flipreact" + messageId),
        sleep(30000)
    ]);
    bot.removeAllListeners("flipreact" + messageId);
    msg.components = [];
    if (!result) {
        msg.embeds[0].footer = {
            text: "This coin flip request has expired."
        };
        interaction.editOriginalMessage(msg);
        return;
    }
    const [reactInteraction, reaction] = result;
    reactInteraction.acknowledge();
    otherUserId = reactInteraction.member.id;
    if (!reaction) {
        msg.embeds[0].footer = {
            text: "This coin flip request has been declined."
        };
        interaction.editOriginalMessage(msg);
        return;
    }
    interaction.editOriginalMessage(msg);
    // flip request accepted
    const stResult = db.startTransaction(userId);
    if (!stResult.success) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    description: stResult.globalError ? `You cannot flip because ${stResult.error}.` : `You cannot flip because <@${userId}> has an ongoing transaction.`
                }
            ]
        });
        return;
    }
    const stResult2 = db.startTransaction(otherUserId);
    if (!stResult2.success) {
        interaction.createFollowup({
            embeds: [
                {
                    color: 15158332,
                    description: stResult2.globalError ? `You cannot flip because ${stResult2.error}.` : `You cannot flip because <@${otherUserId}> has an ongoing transaction.`
                }
            ]
        });
        db.endTransaction(userId);
        return;
    }
    try {
        const myWalletVerification2 = verifyWallet(await db.getWallet(userId), coins, [], [], "flip for", `<@${userId}>'s`);
        if (!myWalletVerification2.success) {
            interaction.createFollowup(myWalletVerification2.failureMessage);
            return;
        }
        const otherWalletVerification2 = verifyWallet(await db.getWallet(otherUserId), coins, [], [], "flip for", `<@${otherUserId}>'s`);
        if (!otherWalletVerification2.success) {
            interaction.createFollowup(otherWalletVerification2.failureMessage);
            return;
        }
        const username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `Coin flip failed as there is no MADFUT username linked to <@${userId}>'s Discord account. To link one, use \`/madfut link <username>\`.`
                    }
                ]
            });
            return;
        }
        const otherUsername = await db.getMadfutUserByDiscordUser(otherUserId);
        if (!otherUsername) {
            interaction.createFollowup({
                embeds: [
                    {
                        color: 15158332,
                        description: `Coin flip failed as there is no MADFUT username linked to <@${otherUserId}>'s Discord account. To link one, use \`/madfut link <username>\`.`
                    }
                ]
            });
            return;
        }
        const transactions = [];
        transactions.push(db.addCoins(userId, iWin ? coins : -coins));
        transactions.push(db.addCoins(otherUserId, iWin ? -coins : coins));
        await Promise.all(transactions);
    } finally{
        db.endTransaction(userId);
        db.endTransaction(otherUserId);
    }
    interaction.createFollowup({
        embeds: [
            {
                color: 16114498,
                author: {
                    name: "Coin flip",
                    icon_url: "https://w7.pngwing.com/pngs/191/349/png-transparent-dogecoin-bitcoin-cryptocurrency-exchange-bitcoin-dog-like-mammal-meme-bitcoin.png"
                },
                description: `**${flipResult ? "Heads" : "Tails"}**! <@${iWin ? userId : otherUserId}> won the coin flip against <@${iWin ? otherUserId : userId}> for **${formatNum(coins)} coins**.`
            }
        ]
    });
});
const allowedPacks = [
    "silver_special",
    "bf_nine_special",
    "bf_five_special",
    "totw",
    "fatal_rare",
    "bf_93_special",
    "bf_95_special",
    "fatal_special",
    "double_special",
    "triple_special",
    "gold",
    "random",
    "gold_super",
    "rare",
    "bf_94_special",
    "bf_eight_special",
    "free",
    "silver_plus",
    "no_totw_special",
    "fatal_silver",
    "85_special",
    "bf_89_special",
    "bf_88_special",
    "bf_four_special",
    "bf_seven_special",
    "gold_mega",
    "special",
    "rainbow",
    "bf_six_special",
    "bf_92_special",
    "80+",
    "bf_86_special",
    "fatal_nonrare",
    "bf_91_special",
    "bf_87_special",
    "silver",
    "op_special",
    "bf_90_special",
    "fatal_rare_silver",
    "pp_sbc_real_madrid_icons",
    "pp_new_87_91",
    "pp_fut_champs",
    "pp_new_81_84",
    "pp_special",
    "pp_special_88_92",
    "pp_best_1",
    "pp_new_83_86",
    "pp_new_77_82",
    "pp_new_85_88",
    "pp_bad_1",
    "pp_totw",
    "pp_new_special",
    "pp_icons_86_92",
    "pp_mega",
    "pp_good_1",
    "pp_icon",
    "pp_special_83_86",
    "pp_special_81_84",
    "pp_special_85_88",
    "pp_special_86_89"
];
bot.on("invme", async (interaction, coins, myPacks)=>{
    const userId = interaction.member.id;
    if (myPacks) {
        if (myPacks.length > 3) {
            interaction.createMessage({
                embeds: [
                    {
                        color: 15417396,
                        description: `❌ You can't pick more than 3 packs.`
                    }
                ],
                flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
        }
        for (const pack of myPacks){
            if (!allowedPacks.includes(pack)) {
                interaction.createMessage({
                    embeds: [
                        {
                            color: 15417396,
                            description: `❌ Invalid pack \`${pack}\`.`
                        }
                    ],
                    flags: Constants.MessageFlags.EPHEMERAL
                });
                return;
            }
        }
    }
    coins = Math.max(Math.min(coins, 10000000), 0);
    const username = await db.getMadfutUserByDiscordUser(userId);
    if (!username) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: "```❌ You have no MADFUT account linked.```"
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: "```✅ Command successful.```"
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    freeTradeUnlimited(username, coins, myPacks ? myPacks.map((pack)=>({
            pack,
            amount: 1
        })
    ) : packs1);
});
bot.on("setpacks", async (interaction, thepacks)=>{
    packs1 = thepacks.map((packname)=>({
            pack: packname,
            amount: 1
        })
    );
    interaction.createMessage({
        embeds: [
            {
                color: 3319890,
                description: "✅ Command successful."
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} set the following packs to giveaways: ${thepacks}`);
});
async function freeTrade2(username, amount, interaction, msg) {
    console.log(`sent ${username} ${amount} trades`);
    let ftRunning = "2";
    let times = amount;
    intervalfuncft();
    let count = 0;
    async function intervalfuncft() {
        let madfutClient;
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `madfut24`); //${generateString(7)}
                console.log(`${username} accepted invite  MAIN.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${username} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: false
                    })
                );
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                await bot.editMessage(interaction.channel.id, msg.id, {
                    embeds: [
                        {
                            color: 1752220,
                            title: `FreeTrades`,
                            description: `Sending bot trades to  <@${interaction.user.id}>.\nYou have ${times} bot trades left.`,
                            thumbnail: {
                                url: 'https://cdn.discordapp.com/avatars/1209623632368640110/1de7b3cadae4e7320483963782b11c19.webp?size=80'
                            }
                        }
                    ]
            });
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
bot.on("freetrade", async (interaction, amount, username, userId)=>{
    if (!username && !userId) {
        interaction.createMessage({
            embeds: [
                {
                    color: 15417396,
                    description: "❌ Enter either a username or a discord user."
                }
            ],
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    } else if (userId) {
        username = await db.getMadfutUserByDiscordUser(userId);
        if (!username) {
            interaction.createMessage({
                embeds: [
                    {
                        color: 15417396,
                        description: "❌ User does not have their MADFUT account linked."
                    }
                ],
                flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
        }
    }
    username = username;
    const msg = interaction.createMessage({
        embeds: [
            {   title: "Free Trades",
                color: 3319890,
                description: `Sent ${amount} bot trades to ${username}.`
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
    await freetradev2(username, amount, interaction)
});
let giveawayRunning = false;
let giveawayStartTimeout;
let giveawayEndTimeout;
let giveawayDuration;
let rawGiveawayDuration;
let giveawayMessage;
bot.on("ga-forcestop", async (interaction)=>{
    giveawayEnd(interaction.channel.id);
    interaction.createMessage({
        content: "Force stop successful",
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} forcestoped the giveaway.`);
    return;
});

bot.on("ga-announce", async (interaction, start, duration) => {
    if (isNaN(parseFloat(start))) {
        interaction.createMessage({
            content: "Enter a valid number of minutes for the start",
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    if (duration && isNaN(parseFloat(start))) {
        interaction.createMessage({
            content: "Enter a valid number of minutes for the duration",
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }

    const durationMinutes = duration ? parseFloat(duration) : undefined;
    rawGiveawayDuration = duration;
    giveawayDuration = durationMinutes ? durationMinutes * 60000 : undefined;

    const minutes = parseFloat(start);
    const startTime = Math.round(Date.now() / 1000 + minutes * 60);

    await interaction.createMessage({
        content: "Command successful",
        flags: Constants.MessageFlags.EPHEMERAL
    });

    const channelId = interaction.channel.id;
    const giveawayEmbed = {
        embeds: [
            {
                title: ".gg/madfut24 | Giveaway",
                description: `<@&${bot.config.giveawayPingRoleId}>, a ${duration ? duration + " minute long " : ""}giveaway is starting in <t:${startTime}:R>m!\nMake sure to be linked!`,
                color: 15548997, // Choisissez votre couleur
                thumbnail: {
                    url: "https://media.discordapp.net/attachments/1215387470099644426/1215845171963363489/PFP_logo.png?ex=65fe3b0e&is=65ebc60e&hm=91a268f15e5bc36e2a2131cb7795fed6bc3d94b5db5f2912d1983ba5a9fa7b3f&=&format=webp&quality=lossless&width=466&height=466", // Remplacez ceci par l'URL de votre image thumbnail
                },
                image: {
                    url: "https://media.discordapp.net/attachments/1219015136937775275/1224791668834959401/banner.png?ex=661ec721&is=660c5221&hm=a7cbf9445bfb13d43045c878c172e59923a990feaa3088f290b5b200251c7799&=&format=webp&quality=lossless&width=1056&height=594"
                }
            },
        ],
    };

    // Envoi du message avec l'embed
    giveawayMessage = await bot.sendMessage(channelId, giveawayEmbed);
    await bot.react(giveawayMessage, "🎉");

    giveawayStartTimeout = setTimeout(() => {
        giveawayStart();
    }, minutes * 15548997);

    return;
});


bot.on("ga-forcestart", async (interaction)=>{
    giveawayStart();
    interaction.createMessage({
        content: "Force start successful",
        flags: Constants.MessageFlags.EPHEMERAL
    });
    console.log(`${interaction.member?.username} forcestart a giveaway.`);
    return;
});
async function giveawayTrade(username) {
    let madfutClient = await madfutclient();
    const traderName2 = await madfutClient.returnUserInfo(username);
    console.log(traderName2);
    let ftRunning = "2";
    let times = 3;
    let count = 0;
    intervalfuncft();
    async function intervalfuncft() {
        for(let i = 0; i < times;){
            madfutClient = await madfutclient();
            let tradeRef;
            if (ftRunning === "1") {
                return madfutClient.logout();
            }
            let traderName;
            try {
                traderName = await madfutClient.returnUserInfo(username);
            } catch (error) {
                await madfutClient.logout();
                return null;
            }
            console.log(traderName);
            try {
                tradeRef = await madfutClient.inviteUser(traderName, `madfut24`);
                console.log(`${username} accepted invite.`);
            } catch  {
                if (++count > 4) return madfutClient.logout();
                console.log(`${username} rejected invite.`);
                await madfutClient.logout();
                continue;
            }
            try {
                await madfutClient.doTrade(tradeRef, async (profile)=>({
                        receiveCoins: false,
                        receiveCards: false,
                        receivePacks: false,
                        giveCards: profile[ProfileProperty.wishList]?.slice(0, 3) ?? [],
                        giveCoins: 10000000,
                        givePacks: false
                    })
                );
                --times;
                console.log(`${username} ${times} trades left`);
                count > 0 && count--;
                //console.log(`Completed trade with ${userId}`);
                await madfutClient.logout();
                //console.log(`Completed trade with ${username}`);
                ftRunning = "1";
                setTimeout(()=>{
                    i++;
                    ftRunning = "2";
                    intervalfuncft();
                }, 4000);
            } catch (_err) {
                await madfutClient.logout();
                console.log(`Unlimited trade with ${username} failed: Player left`);
            }
        }
        madfutClient && madfutClient?.logout();
    }
}
async function giveawayStart() {
    if (giveawayStartTimeout) clearTimeout(giveawayStartTimeout);
    if (giveawayMessage) {
        await bot.editMessage(giveawayMessage.channel.id, giveawayMessage.id, {
            content: `You cannot join the bot giveaway now, the giveaway shall start shortly.`,
            components: []
        });
    }
    bot.removeAllListeners("giveawayjoin");
    giveawayRunning = true;
    const giveawaySignups = await db.getMadfutUsersByDiscordUsers(await bot.getReacts(giveawayMessage, "🎉"));
    for (const username of giveawaySignups){
        giveawayTrade(username);
    }
    await bot.sendMessage(giveawayMessage.channel.id, {
        allowedMentions: {
            roles: [
                bot.config.giveawayPingRoleId
            ]
        },
        content: `<@&${bot.config.giveawayPingRoleId}>, the ${rawGiveawayDuration ? rawGiveawayDuration + " minute long " : ""}giveaway has started with **${giveawaySignups.length} people**! Look at your invites and enjoy the free coins and wishlist cards.`
    });
    if (giveawayDuration) {
        giveawayEndTimeout = setTimeout(()=>{
            giveawayEnd(giveawayMessage.channel.id);
        }, giveawayDuration);
    }
}
async function giveawayEnd(channelId) {
    giveawayRunning = false;
    if (giveawayEndTimeout) clearTimeout(giveawayEndTimeout);
    bot.sendMessage(channelId, {
        allowedMentions: {
            roles: [
                bot.config.giveawayPingRoleId
            ]
        },
        content: `<@&${bot.config.giveawayPingRoleId}>, the giveaway bot has finished.`
    });
}

console.log("Bot event listeners registered");
console.log("MADFUT 24 Bot - Started");

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("Node NOT Exiting...");
});