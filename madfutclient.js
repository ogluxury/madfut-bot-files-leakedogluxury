import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential, fetchSignInMethodsForEmail, signInWithCustomToken } from 'firebase/auth';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getRandomInt, sleep, createTask } from "./util.js";
import { getDatabase, ref, onValue, onChildAdded, onChildChanged, onChildRemoved, onChildMoved, set, update, serverTimestamp, onDisconnect, off, get } from "firebase/database";
import { CustomProvider, initializeAppCheck } from "firebase/app-check";
import { getFirestore, collection, getDocs, setDoc, doc, query, limit, where } from "firebase/firestore";
import fetch from 'node-fetch';
import fs from 'fs';
import { tokens } from './refresh.js';
import config from './config.js'
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

let currentIndex = 0;

function randomrefresh() {
    if (currentIndex >= tokens.length) {
        currentIndex = 0;
    }
    const nextToken = tokens[currentIndex];
    currentIndex++;
    return nextToken;
    console.log(nextToken);
}




function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for(let i = 0; i < length; i++){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function getRandom(min, max) {
    let len = getRandInt(min, max);
    let a = String(btoa((Math.random() + 1).toString(36))).replace("=", "").toLowerCase();
    return a.length > len ? a.substring(a.length - len) : a;
}
function getRandInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
var ProfileProperty1;
(function(ProfileProperty) {
    ProfileProperty["uid"] = 'a';
    ProfileProperty["username"] = 'b';
    ProfileProperty["nationId"] = 'c';
    ProfileProperty["wishList"] = 'd';
    ProfileProperty["messages"] = 'e';
    ProfileProperty["collectionPercentage"] = 'g';
})(ProfileProperty1 || (ProfileProperty1 = {
}));
const EmptyTradeRequirement = {
    receiveCoins: false,
    giveCoins: 0,
    givePacks: [],
    receivePacks: false,
    giveCards: [],
    receiveCards: false
};
var ActionType1;
(function(ActionType) {
    ActionType["loaded"] = 'b';
    ActionType["putCard"] = 'e';
    ActionType["putPack"] = 'o';
    ActionType["putCoins"] = 'q';
    ActionType["ready"] = 'h';
    ActionType["unready"] = 'i';
    ActionType["confirm"] = 'k';
    ActionType["handshake"] = 'l';
    ActionType["cancel"] = 'j';
    ActionType["wantCoinsMessage"] = 'r';
    ActionType["sendEmoji"] = 'n';
})(ActionType1 || (ActionType1 = {
}));
function isTradeHandshake(action) {
    return action.x === ActionType1.handshake;
}
let Rtoken;
let loginCount = 0;
const maxLogins = 1000;
let timeFrame;
let timer;
let onlineValue; // Make sure onlineValue is initialized before this block

if (onlineValue === 1) {
    timeFrame = 60000 * 3; // 3 minutes in milliseconds
    onlineValue = 1;
} else {
    timeFrame = 10000; // 10 seconds in milliseconds
    onlineValue = 0;
}

class MadfutClient {
    async logout() {
        if (onlineValue === 1) {
            return;
        }
        try {
            if (!this.auth.currentUser) {
                console.log('Trying to sign out of unknown acc');
                this.auth.signOut();
                return;
            }
            let email = this.auth.currentUser.email;
            console.log('Logging out');
            let ind = MadfutClient.inUse.indexOf(email);
            this.auth.signOut();
            MadfutClient.inUse.splice(ind, 1);
        } catch (error) {
        }
    }
    
    async login() {
        await sleep(200)
        loginCount++;

        // Check if the login count exceeds the threshold
        if (loginCount >= maxLogins) {
            // Set the value to 1 when the threshold is reached
            onlineValue = 1;

            // Reset the login count

            // Clear the timer if it's already set
            if (timer) {
                await sleep(200 * 60 * 3)
                clearTimeout(timer);
                onlineValue = 0;
            }
        } else {
            if (onlineValue === 1) {
                return;
            }
            // If not reached, set a timer to reset the login count after the time frame
            if (!timer) {
                if (onlineValue === 1) {
                    return;
                }
                timer = setTimeout(() => {
                    // Set the value to 0 when the timer resets the login count
                    onlineValue = 0;
                    loginCount = 0;
                    timer = null;
                }, timeFrame);
            }
        }
        if (onlineValue === 1) {
            return;
        }
        const clientId = '660557070780-5h8jeccpts8k5ggsc3c5rlreurlab4h5.apps.googleusercontent.com';
        const clientSecret = '';
        const refreshToken = `${randomrefresh().token}`;

        // Your random token generation logic...
        
        try {
            const data = fs.readFileSync('rtoken.txt', 'utf8');
            Rtoken = data.trim();
        } catch (err) {
            console.error('Error reading Rtoken from file:', err.message);
        }

        const url = 'https://oauth2.googleapis.com/token';
        const data = {
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        };
    
        const resHaha = await axios.post(url, null, {
            params: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'MADFUT/13 CFNetwork/1474 Darwin/23.0.0',
            },
        })

        const responseData = resHaha.data;
        const idTokenNew = responseData.id_token
        const accessTokenNew = responseData.access_token
        const credentials = GoogleAuthProvider.credential(idTokenNew, accessTokenNew)

        const { user } = await signInWithCredential(this.auth, credentials)
        this.username = "goavwici";
        this.nationId = "club_large_243";
        this.uid = user.uid;
        this.authdb = getDatabase(this.app, "mf24-room-ids.europe-west1.firebasedatabase.app");
        console.log('Logged into account!\nUID: ' + this.uid)
        this.tradingRoomDatabase = getDatabase(this.app, "https://mf24-trading-2-rooms.europe-west1.firebasedatabase.app");
        this.invitesDatabase = getDatabase(this.app);
        this.loggedIn = true;
        this.loggedIn = true;
    } 
    async logoutEverywhere() {
       if(!this.auth.currentUser) return console.log('No Accounts to sign out')
        else{
            await logout()
            if(!this.auth.currentUser) return console.log('Logged out all accounts!\n' + MadfutClient.inUse)
                await LogoutEverywhere()
}
}
         async addInviteListenerNewBoth(callback, invitee, codename) {
        if (this.uid != null) {
            console.log(this.uid);
            try {
                const invitesRef = ref(this.invitesDatabase, invitee || this.auth.currentUser?.uid);
                console.log("Add invite listener to ref:", invitesRef.toString());
                onChildAdded(invitesRef, (snapshot)=>{
                    console.log("Child added:", snapshot.key);
                    callback(snapshot.key);
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    console.log("Child changed:", snapshot.key, snapshot.val());
                    if (typeof snapshot.val() === 'number') {
                        console.log(snapshot.val());
                        callback(snapshot.key);
                    }
                });
                setTimeout(async ()=>{
                    off(invitesRef);
                    await addListenerBoth(null, codename);
                }, 3600000);
            } catch (err) {
                console.log("Error in addInviteListenerNewBoth:", err);
                await addListenerBoth(null, codename);
            }
        }
    }
    async addInviteListenerNewAuto(callback, invitee, codename, rndTime) {
        if (this.uid != null) {
            console.log(this.uid);
            const randTime = rndTime
            console.log(randTime + " madfutclient.js")
            await setTimeout(async ()=>{
                console.log("7 second timeout (madfutclient.js)")
                
            
            try {
                const invitesRef = ref(this.invitesDatabase, invitee || this.auth.currentUser?.uid);
                console.log("Add invite listener to ref:", invitesRef.toString());
                onChildAdded(invitesRef, (snapshot)=>{
                    console.log("Child added:", snapshot.key);
                    callback(snapshot.key);
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    console.log("Child changed:", snapshot.key, snapshot.val());
                    if (typeof snapshot.val() === 'number') {
                        console.log(snapshot.val());
                        callback(snapshot.key);
                    }
                });
               await setTimeout(async ()=>{
                    off(invitesRef);
console.log('Bot Code Finished')
                }, randTime);
            } catch (err) {
                console.log("Error in addInviteListenerNewAuto:", err);
                await addListenerAuto(null, codename, randTime);
            }
                }, 7000);
        }
    }
    async addInviteListenerNewPacks(callback, invitee, codename) {
        if (this.uid != null) {
            console.log(this.uid);
            try {
                const invitesRef = ref(this.invitesDatabase, invitee || this.auth.currentUser?.uid);
                console.log("Add invite listener to ref:", invitesRef.toString());
                onChildAdded(invitesRef, (snapshot)=>{
                    console.log("Child added:", snapshot.key);
                    callback(snapshot.key);
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    console.log("Child changed:", snapshot.key, snapshot.val());
                    if (typeof snapshot.val() === 'number') {
                        console.log(snapshot.val());
                        callback(snapshot.key);
                    }
                });
                setTimeout(async ()=>{
                    off(invitesRef);
                    await addListenerPacks(null, codename);
                }, 3600000);
            } catch (err) {
                console.log("Error in addInviteListenerNewPacks:", err);
                await addListenerPacks(null, codename);
            }
        }
    }
    async addInviteListenerNewCards(callback, invitee, codename) {
        if (this.uid != null) {
            console.log(this.uid);
            try {
                const invitesRef = ref(this.invitesDatabase, invitee || this.auth.currentUser?.uid);
                console.log("Add invite listener to ref:", invitesRef.toString());
                onChildAdded(invitesRef, (snapshot)=>{
                    console.log("Child added:", snapshot.key);
                    callback(snapshot.key);
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    console.log("Child changed:", snapshot.key, snapshot.val());
                    if (typeof snapshot.val() === 'number') {
                        console.log(snapshot.val());
                        callback(snapshot.key);
                    }
                });
                setTimeout(async ()=>{
                    off(invitesRef);
                    await addListenerCards(null, codename);
                }, 3600000);
            } catch (err) {
                console.log("Error in addInviteListenerNewCards:", err);
                await addListenerCards(null, codename);
            }
        }
    }
    async addInviteListenerNewBothD(callback, invitee, codename, duration) {
        const duration1 = duration * 1000
        if (this.uid != null) {
            console.log(this.uid);
            try {
                const invitesRef = ref(this.invitesDatabase, invitee || this.auth.currentUser?.uid);
                console.log("Add invite listener to ref:", invitesRef.toString());
                onChildAdded(invitesRef, (snapshot)=>{
                    console.log("Child added:", snapshot.key);
                    callback(snapshot.key);
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    console.log("Child changed:", snapshot.key, snapshot.val());
                    if (typeof snapshot.val() === 'number') {
                        console.log(snapshot.val());
                        callback(snapshot.key);
                    }
                });
                setTimeout(async ()=>{
                    off(invitesRef);
                    console.log(codename + ' has ended!')
                }, duration1);
            } catch (err) {
                console.log("Error in addInviteListenerNewBoth:", err);
                await addListenerBothD(null, codename, duration);
            }
        }
    }
    async addInviteListenerNewPacksD(callback, invitee, codename, duration) {
        const duration1 = duration * 1000
        if (this.uid != null) {
            console.log(this.uid);
            try {
                const invitesRef = ref(this.invitesDatabase, invitee || this.auth.currentUser?.uid);
                console.log("Add invite listener to ref:", invitesRef.toString());
                onChildAdded(invitesRef, (snapshot)=>{
                    console.log("Child added:", snapshot.key);
                    callback(snapshot.key);
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    console.log("Child changed:", snapshot.key, snapshot.val());
                    if (typeof snapshot.val() === 'number') {
                        console.log(snapshot.val());
                        callback(snapshot.key);
                    }
                });
                setTimeout(async ()=>{
                    off(invitesRef);
                    console.log(codename + ' has ended!')
                }, duration1);
            } catch (err) {
                console.log("Error in addInviteListenerNewPacks:", err);
                await addListenerPacksD(null, codename, duration);
            }
        }
    }
    async addInviteListenerNewCardsD(callback, invitee, codename, duration) {
        const duration1 = duration * 1000
        if (this.uid != null) {
            console.log(this.uid);
            try {
                const invitesRef = ref(this.invitesDatabase, invitee || this.auth.currentUser?.uid);
                console.log("Add invite listener to ref:", invitesRef.toString());
                onChildAdded(invitesRef, (snapshot)=>{
                    console.log("Child added:", snapshot.key);
                    callback(snapshot.key);
                });
                onChildChanged(invitesRef, (snapshot)=>{
                    console.log("Child changed:", snapshot.key, snapshot.val());
                    if (typeof snapshot.val() === 'number') {
                        console.log(snapshot.val());
                        callback(snapshot.key);
                    }
                });
                setTimeout(async ()=>{
                    off(invitesRef);
                    console.log(codename + ' has ended!')
                }, duration1);
            } catch (err) {
                console.log("Error in addInviteListenerNewCardsD:", err);
                await addListenerCardsD(null, codename, duration);
            }
        }
    }
    addInviteListener(callback, invitee) {
        const invitesRef = ref(this.invitesDatabase, this.uid);
        onChildAdded(invitesRef, (snapshot)=>{
            if (snapshot != null) {
                callback(snapshot.key);
            }
        });
        onChildChanged(invitesRef, (snapshot)=>{
            if (typeof snapshot.val() === 'number') {
                callback(snapshot.key);
            }
        });
    }
    async setBotCodeUsername(username) {
        let db = getFirestore(this.app);
        setDoc(doc(db, "usernames", username), {
            uid: this.uid,
            badgeName: this.nationId
        });
    }
    invitewu(username1) {
        return new Promise(async (resolve)=>{
            let inviteData = {
                "b": "club_large_243",
                "t": serverTimestamp(),
                "u": `PRIMEFUT`
            };
            try {
                let path = username1 + "/" + this.uid;
                let inviteRef = ref(this.invitesDatabase, path);
                try {
                    await set(inviteRef, inviteData);
                } catch (error) {
                    await set(inviteRef, inviteData);
                //return console.log("This bot account is banned", error.message);
                }
                let timeoutObj = setTimeout(()=>{
                    off(inviteRef);
                    set(inviteRef, null).then((e)=>{
                    }).catch((err)=>console.log("This bot account is banned")
                    );
                }, 60000);
                onDisconnect(inviteRef).remove();
                let tradeData = ref(this.authdb, this.uid);
                onValue(tradeData, async (snapshot)=>{
                    if (typeof snapshot.val() !== 'string') return;
                    if (snapshot.val().toString().split(",")[0] == null) return;
                    let tradeRef = ref(this.tradingRoomDatabase, snapshot.val().toString().split(",")[0]);
                    if (await (await get(tradeRef)).val() == null) return;
                    if (await await get(tradeRef) == null) return;
                    if (await (await get(tradeRef)).val().u1 == null) return;
                    if (await (await get(tradeRef)).val().u1 == username1) {
                        try {
                            await set(inviteRef, null);
                            await set(tradeData, null);
                        } catch  {
                            console.log("This bot account is banned");
                        }
                        clearTimeout(timeoutObj);
                        if (snapshot.val().toString().split(",")[1] == "true") {
                            resolve({
                                tradeRef,
                                amHosting: true
                            });
                        } else if (snapshot.val().toString().split(",")[1] == "false") {
                            resolve({
                                tradeRef,
                                amHosting: false
                            });
                        }
                    }
                });
            } catch (error) {
                console.log(error);
            }
        });
    }
    async returnUserInfo(invitee1) {
        const myFirestore = getFirestore(this.app);
        const myCollection = query(collection(myFirestore, "users"), limit(1), where("username", "==", invitee1));
        const users = await getDocs(myCollection);
        let userId = '';
        users.forEach((user)=>{
            userId = user.id;
        });
        return userId;
    }
    async inviteUserCb(invitee2, callback1, inviter) {
        const invitePath = "/" + (inviter || this.username) + "," + this.nationId + "," + this.uid;
        const inviteRef = ref(this.invitesDatabase, invitePath);
        onDisconnect(inviteRef).remove();
        await set(inviteRef, Date.now() + 31536000000); // or serverTimestamp()
        onValue(inviteRef, (snapshot)=>{
            if (typeof snapshot.val() === 'number') return;
            if (snapshot.val() == null) {
                off(inviteRef);
                callback1(null);
                return;
            }
            // invite accepted
            const tradeRef = ref(this.tradingRoomDatabase, snapshot.val());
            callback1({
                tradeRef,
                amHosting: true
            });
        });
    }
    inviteWithTimeout(invitee3, timeout, inviter1) {
        let fix = {
            t: serverTimestamp(),
            u: inviter1
        };
        // let uid = ["4LBTVCJgkEN5xsBKN2uwZQweN0N2"]
        // let uid = ["WCFXd2jAPWTV89lCBvAY9b0np3P2"]
        // let uid = "WCFXd2jAPWTV89lCBvAY9b0np3P2"
        let done = false;
        return new Promise(async (resolve, reject)=>{
            const invitePath = invitee3 + "/" + this.uid;
            const inviteRef = ref(this.invitesDatabase, invitePath);
            const dbRef2 = ref(this.authdb, this.uid);
            onDisconnect(inviteRef).remove();
            await set(inviteRef, fix);
            // await set(inviteRef, serverTimestamp()); // or serverTimestamp()
            onValue(dbRef2, (snapshot)=>{
                // console.log(snapshot.key, snapshot.val())s
                // console.log("snap",snapshot.val())
                if (typeof snapshot.val() !== 'string') return;
                const tradeRef = ref(this.tradingRoomDatabase, snapshot.val().toString().split(",")[0]);
                const check = snapshot.val().toString().split(",")[1];
                done = true;
                set(inviteRef, null);
                set(dbRef2, null);
                off(dbRef2);
                resolve({
                    tradeRef,
                    amHosting: check == 'true'
                });
            });
            setTimeout(()=>{
                if (done) return;
                set(inviteRef, null);
                set(dbRef2, null);
                off(dbRef2);
                reject('User didn\'t accept in time');
            }, 1000 * 60);
            try {
                await set(inviteRef, fix);
            } catch (error) {
            }
        });
    }
    leaveTrade({ tradeRef: tradeRef1 , amHosting  }) {
        return set(tradeRef1, null);
    }
    inviteUser(invitee4, inviter2) {
        let fix = {
            b: this.nationId,
            i: invitee4,
            t: serverTimestamp(),
            u: inviter2
        };


        let done = false;
        return new Promise(async (resolve, reject) => {

            const invitePath = "/" + this.uid


            const inviteRef = ref(this.invitesDatabase, invitePath);

            onDisconnect(inviteRef).remove();

            let dbRef2 = ref(this.authdb, this.uid);

            let dbRef3 = ref(this.authdb, invitee4 + "/" + this.uid);

            onValue(dbRef2, (snapshot) => {
                if (typeof snapshot.val() !== 'string') return;
                const tradeRef = ref(this.tradingRoomDatabase, snapshot.val().toString().split(",")[0]);
                const check = snapshot.val().toString().split(",")[1];
                done = true;
                set(inviteRef, null);
                set(dbRef2, null);
                off(dbRef2);
                resolve({
                    tradeRef,
                    amHosting: check == 'true'
                });
            });


            onValue(dbRef3, (snapshot) => {
                if (typeof snapshot.val() !== 'string') return;
                console.log(snapshot.val());
            });


            setTimeout(async () => {
                if (done) return;
                await set(inviteRef, null);
                await set(dbRef2, null);
                off(dbRef2);
                reject('User didn\'t accept in time');
            }, 1000 * 30);
            try {
                await set(inviteRef, fix);
            } catch (error) {
            }
        });
    }

    inviteUserSpam(invitee5, nation, inviter3) {
        return new Promise(async (resolve, reject)=>{
            const invitePath = invitee5 + "/" + (inviter3 || this.username) + "," + nation + "," + this.uid;
            const inviteRef = ref(this.invitesDatabase, invitePath);
            onDisconnect(inviteRef).remove();
            await set(inviteRef, serverTimestamp()); // or serverTimestamp()
            onValue(inviteRef, (snapshot)=>{
                if (typeof snapshot.val() === 'number') return;
                if (snapshot.val() == null) {
                    off(inviteRef);
                    return;
                }
                // invite accepted
                const tradeRef = ref(this.tradingRoomDatabase, snapshot.val());
                off(tradeRef);
                resolve({
                    tradeRef,
                    amHosting: false
                });
                set(inviteRef, null);
            });
        });
    }
    acceptInvite(inviter4, invitee6) {
        return new Promise(async (resolve)=>{
            //  const inviteStr = inviteArr.join("");
            let bee = {
                b: this.nationId,
                t: serverTimestamp(),
                u: inviter4
            };
            const inviteRef = ref(this.invitesDatabase, this.uid);
            let dbRef2 = ref(this.authdb, this.uid);
            let dbRef = ref(this.invitesDatabase, this.uid + "/" + inviter4);
            onValue(dbRef, (snapshot)=>{
                const data = snapshot.val();
                const key = snapshot.key;
            });
            onChildAdded(dbRef, (snapshot)=>{
                const data = snapshot.val();
                const key = snapshot.key;
                //  let uid = "hDOE4mBFZ8goZsPce7sOg0Dd7023"
                const data2 = snapshot.ref.toJSON();
            });
            onChildChanged(dbRef, (snapshot)=>{
                const data = snapshot.val();
                const key = snapshot.key;
                const data2 = snapshot.ref.toJSON();
            });
            onChildMoved(dbRef, (snapshot)=>{
                const data = snapshot.val();
                const key = snapshot.key;
            });
        // const inviteStr = snapshot2.val().toString().split(",")[0]
        //  set(inviteRef, bee);
        // const tradeRef = ref(this.tradingRoomDatabase, snapshot2.val().toString().split(",")[0])
        // update(tradeRef, {
        //     h: {
        //         a: this.uid,
        //         b: this.username,
        //         c: this.nationId,
        //         d: [],
        //         e: [],
        //         f: '',
        //         g: '10000000',
        //         h: '',
        //         i: '',
        //         j: '',
        //         k: ''
        //     },
        //     H: {
        //         x: ActionType.loaded
        //     }
        // });
        // off(dbRef);
        // resolve({ tradeRef, amHosting: false });
        // set(dbRef2, null);
        });
    }
    doTrade({ tradeRef , amHosting: amHosting1  }, giver) {
        return new Promise(async (resolve, reject)=>{
            const otherProfile = amHosting1 ? "g" : "h";
            const otherAction = amHosting1 ? "G" : "H";
            const ownProfile = amHosting1 ? "h" : "g";
            const ownAction = amHosting1 ? "H" : "G";
            let loaded = false;
            let tradeReqTask = createTask();
            const self = this;
            async function childUpdate(snapshot) {
                
                const snapshotVal = snapshot.val();
                if (snapshotVal === null) return;
                if (snapshot.key === otherProfile) {
                    await sleep(100)
                    tradeReqTask.finish(await giver(snapshotVal));
                    await update(tradeRef, {
                        [ownProfile]: {
                            a: self.uid,
                            b: self.username,
                            c: self.nationId,
                            d: [],
                            e: [
                                1,
                                2
                            ],
                            f: '',
                            g: '100',
                            h: '',
                            i: '',
                            j: '',
                            k: '',
                            n: '12',
                            x: ''
                        },
                        [ownAction]: {
                            x: ActionType1.loaded
                        },
                        ts: serverTimestamp()
                    });
                } else if (snapshot.key === otherAction) {
                    const tradeReq = await tradeReqTask.promise;
                    if (snapshotVal.x === ActionType1.loaded) {
                        loaded = true;
                        await sleep(1);
                        for(let i = 0; i < tradeReq.giveCards.length; i++){
                            await update(tradeRef, {
                                [ownAction]: {
                                    v: `${tradeReq.giveCards[i]},${i}`,
                                    x: ActionType1.putCard
                                }
                            });
                        }
                        for(let i2 = 0; i2 < tradeReq.givePacks.length; i2++){
                            await update(tradeRef, {
                                [ownAction]: {
                                    a: tradeReq.givePacks[i2].pack,
                                    b: tradeReq.givePacks[i2].amount,
                                    c: i2,
                                    x: ActionType1.putPack
                                }
                            });
                        }
                        await update(tradeRef, {
                            [ownAction]: {
                                v: Math.max(tradeReq.giveCoins, 0),
                                x: ActionType1.putCoins
                            }
                        });
                        await update(tradeRef, {
                            [ownAction]: {
                                x: ActionType1.ready
                            }
                        });
                        await update(tradeRef, {
                            [ownAction]: {
                                x: ActionType1.ready,
                                v: "",
                                x: "n"
                            }
                        });
                    } else if (snapshotVal.x === ActionType1.confirm) {
                        await update(tradeRef, {
                            [ownAction]: {
                                x: ActionType1.confirm
                            }
                        });
                        await update(tradeRef, {
                            [ownAction]: {
                                v: "11P",
                                x: "n"
                            }
                        });
                    } else if (isTradeHandshake(snapshotVal)) {
                        const updates = [];
                        // a: cards I'm giving
                        // b: cards I'm getting
                        // c: packs I'm giving
                        // d: packs I'm getting
                        // e: net coins I'm getting
                        const newAction = {
                            x: ActionType1.handshake
                        };
                        const cardsGivenByOther = snapshotVal.a ?? [];
                        if (!tradeReq.receiveCards && cardsGivenByOther.length > 0) {
                            updates.push({
                                [ownAction]: {
                                    v: "10",
                                    x: ActionType1.sendEmoji
                                }
                            });
                        }
                        newAction.b = cardsGivenByOther;
                        const packsGivenByOther = snapshotVal.c ?? {
                        };
                        if (!tradeReq.receivePacks && Object.keys(packsGivenByOther).length > 0) {
                            updates.push({
                                [ownAction]: {
                                    v: "10",
                                    x: ActionType1.sendEmoji
                                }
                            });
                        }
                        newAction.d = packsGivenByOther;
                        const gottenCards = snapshotVal.b ?? []; // TODO: shortcut with alreadyUpdated
                        for(let i = 0, j = 0; i < tradeReq.giveCards.length; i++, j++){
                            if (tradeReq.giveCards[i] != gottenCards[j]) {
                                updates.push({
                                    [ownAction]: {
                                        v: `${tradeReq.giveCards[i]},${i}`,
                                        x: ActionType1.putCard
                                    }
                                });
                                j--;
                            }
                        }
                        newAction.a = tradeReq.giveCards;
                        const gottenPacks = snapshotVal.d ?? {
                        };
                        for(let i3 = 0, j1 = 0; i3 < tradeReq.givePacks.length; i3++, j1++){
                            if (!(tradeReq.givePacks[i3].pack in gottenPacks)) {
                                updates.push({
                                    [ownAction]: {
                                        a: tradeReq.givePacks[i3].pack,
                                        b: tradeReq.givePacks[i3].amount,
                                        c: i3,
                                        x: ActionType1.putPack
                                    }
                                });
                                gottenPacks[tradeReq.givePacks[i3].pack] = tradeReq.givePacks[i3].amount;
                                j1--;
                            }
                        }
                        newAction.c = gottenPacks;
                        let gottenCoins = snapshotVal.e ?? 0;
                        if (gottenCoins < tradeReq.giveCoins && !tradeReq.receiveCoins) {
                            updates.push({
                                [ownAction]: {
                                    v: Math.max(tradeReq.giveCoins, 0),
                                    x: ActionType1.putCoins
                                }
                            });
                            updates.push({
                                [ownAction]: {
                                    v: '00',
                                    x: ActionType1.wantCoinsMessage
                                }
                            });
                        }
                        newAction.e = -gottenCoins;
                        if (updates.length === 0) {
                            await update(tradeRef, {
                                [ownAction]: newAction
                            });
                            off(tradeRef);
                            resolve({
                                givenCards: newAction.a,
                                givenPacks: newAction.c,
                                netCoins: newAction.e,
                                receivedCards: newAction.b,
                                receivedPacks: newAction.d
                            });
                        } else {
                            await update(tradeRef, {
                                [ownAction]: {
                                    x: ActionType1.cancel
                                }
                            });
                            await sleep(1);
                            for (const updateElem of updates){
                                await update(tradeRef, updateElem);
                            }
                        }
                    }
                }
            }
            onChildAdded(tradeRef, childUpdate);
            onChildChanged(tradeRef, childUpdate);
            onValue(tradeRef, async (snapshot)=>{
                if (snapshot.val() == null && loaded) {
                    off(tradeRef);
                }
            });
        });
    }
    constructor(token){
        this.loggedIn = false;
        this.token = token;
        this.app = initializeApp({
            apiKey: "AIzaSyDoKIYxnzKUiIl9qh-VP8K8DDJqxQUyh7U",
            authDomain: "mf24-room-ids.europe-west1.firebasedatabase.app",
            projectId: "madfut-24",
            storageBucket: "madfut-24.appspot.com",
            messagingSenderId: "1696019706958",
            databaseURL: "https://mf24-trading-2-invites-queue.europe-west1.firebasedatabase.app",
            appId: "1:660557070780:ios:f13e299f33f10eba9c2bb9"
        }, Math.random().toPrecision(1));
        initializeAppCheck(this.app, {
            provider: new CustomProvider({
                getToken: ()=>{
                    return Promise.resolve({
                        token: this.token,
                        expireTimeMillis: 1637066608 * 1000 // TODO: read from token
                    });
                }
            })
        });
        this.auth = getAuth(this.app);
    }
}
export { onlineValue, MadfutClient };
MadfutClient.inUse = [];
export default MadfutClient;
export { ProfileProperty1 as ProfileProperty};