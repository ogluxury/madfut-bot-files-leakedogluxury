import Eris, { CommandInteraction, ComponentInteraction, Constants, Interaction } from "eris";
import { once, EventEmitter } from "events";
import { readFileFromURL } from "./util.js";
import config from "./config.js";
const bot = Eris(config.botToken, {
    intents: [
        "guilds",
        "guildMessages"
    ]
});
const permittedReacts = {
};
class DiscordBot extends EventEmitter {
    setPermittedReact(messageId, userId1) {
        permittedReacts[messageId] = userId1;
    }
    sendMessage(channelId, content) {
        return bot.createMessage(channelId, content);
    }
    editMessage(channelID, messageID, content1) {
        return bot.editMessage(channelID, messageID, content1);
    }
    getReacts(message2, emoji) {
        return new Promise(async (resolve)=>{
            const res = [];
            let after;
            let added = 0;
            do {
                const users = await message2.getReaction(emoji, after ? {
                    after
                } : {
                });
                added = users.length;
                after = users[users.length - 1]?.id;
                res.push(...users.map((user)=>user.id
                ));
            }while (added === 100)
            resolve(res);
        });
    }
    async react(message1, emoji1) {
        return message1.addReaction(emoji1);
    }
    constructor(){
        super();
        this.config = config;
    }
}
const exportedBot = new DiscordBot();
bot.on("error", (err)=>{
    console.error("[DISCORD BOT ERROR]", err); // or your preferred logger
});
bot.connect();
await Promise.all([
    once(bot, "ready")
]);
console.log("MadFUT Legends Madfut Bot 2024");
// bot initialization start
bot.editStatus({
        name: "MadFUT With MFL",
    type: Constants.ActivityTypes.GAME,
    url: "https://discord.gg/neyfut"
});

const boosterSpinCommand = {
    name: "boost",
    description: "Spin the wheel to claim your boost rewards!",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
};

const linkCommand = {
    name: "link",
    description: "Links your Discord account to a MADFUT username",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "username",
            description: "Your MADFUT 24 username your trying to link with, no capitals or spaces.",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        }
    ]
}
const botCodeCommand = {
    name: "botcode",
    description: "Create a botcode",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "codename",
            description: "Set the codename",
type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        },
        {
            name: "type",
            description: "[PACKS OR CARDS] The type of bot code do you want to create!",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {
                    name: "WISHLIST",
                    value: "wishlist"
}
            ],
            required: true
        },
        {
            name: "duration",
            description: "Time in minutes",
            type: Constants.ApplicationCommandOptionTypes.NUMBER,
            required: true
        }
    ]
};
const supplierCommand = {
    name: "supplier",
    description: "[SUPPLIER ONLY] Have 7 bot trades per day",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND, 
};
const claimJoinCommand = {
    name: "join",
    description: "Claim Join Rewards!",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
};
const resetJoinCommand = {
    name: "r-join",
    description: "Reset Join Rewards!",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "user",
            description: "DISCORD USER",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: true
        }
    ]
};
const morpionCommand = {
    name: "morpion",
    description: "start games",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
};
const freecoinsCommand = {
    name: "free-coins",
    description: "Spin the wheel",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
};
const dailyCommand = {
    name: "dailyspin",
    description: "Spin the wheel",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
};
const giveawayCommand = [
    {
        name: "ga-announce",
        description: "[ADMIN] Announce a giveaway",
        type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
        options: [
            {
                name: "start",
                description: "When to start the giveaway",
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            },
            {
                name: "duration",
                description: "Duration of the giveaway",
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true
            }, 
        ]
    },
    {
        name: "ga-forcestart",
        description: "[ADMIN] Force start a giveaway",
        type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
    },
    {
        name: "ga-forcestop",
        description: "[ADMIN] Force end a giveaway",
        type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
    }
];
const flipCommand = {
    name: "flip",
    description: "Flip a coin with another user for coins",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "coins",
            description: "The amount of coins you want to flip for",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: true
        },
        {
            name: "side",
            description: "The side you pick",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            choices: [
                {
                    name: "Heads",
                    value: "heads"
                },
                {
                    name: "Tails",
                    value: "tails"
                }
            ],
            required: true
        },
        {
            name: "user",
            description: "The user you want to flip with. Omit to flip with anyone who accepts.",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: false
        }
    ]
};

const forceEndTransactionMeCommand = {
    name: "force-end-transaction-me",
    description: "Force ends your transaction.",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
};
const unlinkCommand = {
    name: "unlink",
    description: "Unlink your MADFUT Account to your discord account! (MUST BE LINKED ALREADY)",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
};
    const updateNamesCommand = {
    name: "un",
    description: "[ADMIN] 🤫",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
};
const freeTradeCommand = {
    name: "ft",
    description: "[ADMIN] 🤫",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "amount",
            description: "a 🤷‍♀️",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: true
        },
        {
            name: "username",
            description: "u 🤷‍♀️",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: true
        }
    ]
};
const walletCommand = {
    name: "wallet",
    description: "Display your wallet",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "user",
            description: "The user you want to display the wallet from",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: false
        },
        {
            name: "page",
            description: "The page you want to display",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        }
    ]
};
const depositCommand = {
    name: "deposit",
    description: "Deposit cards, packs or coins into your wallet",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "multiple",
            description: "Whether you want to make multiple deposits in one go",
            type: Constants.ApplicationCommandOptionTypes.BOOLEAN
        }
    ]
};
const withdrawAllCommand = {
    name: "withdraw-all",
    description: "Withdraw your entire wallet",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND
};
const withdrawCommand = {
    name: "withdraw",
    description: "Withdraw cards, packs or coins from your wallet",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "coins",
            description: "The amount of coins to withdraw from your wallet",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        },
        {
            name: "cards",
            description: "A comma-separated list of cards to withdraw from your wallet",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "packs",
            description: "A comma-separated list of packs to withdraw from your wallet",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        }
    ]
};
const payCommand = {
    name: "pay",
    description: "Pay another user with cards, packs or coins from your wallet",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "user",
            description: "The user you want to pay",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: true
        },
        {
            name: "coins",
            description: "The amount of coins to pay to the other user",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        },
        {
            name: "cards",
            description: "A comma-separated list of cards to pay to the other user",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "packs",
            description: "A comma-separated list of packs to pay to the other user",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "bottrades",
            description: "The amount of bot trades to pay to the other user",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        }
    ]
};
const tradeCommand = {
    name: "trade",
    description: "Trade cards, packs or coins from your wallet with another user",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "user",
            description: "The user you want to trade with",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: true
        },
        {
            name: "givecoins",
            description: "The amount of coins you want to give",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        },
        {
            name: "givecards",
            description: "A comma-separated list of cards you want to give",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "givepacks",
            description: "A comma-separated list of packs you want to give",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "givebottrades",
            description: "The amount of bot trades you want to give",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        },
        {
            name: "receivecoins",
            description: "The amount of coins you want to receive",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        },
        {
            name: "receivecards",
            description: "A comma-separated list of cards you want to receive",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "receivepacks",
            description: "A comma-separated list of packs you want to receive",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "receivebottrades",
            description: "The amount of bot trades you want to receive",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        }
    ]
};
const forceEndTransactionCommand = {
    name: "force-end-transaction",
    description: "[ADMIN ONLY] ⚠️ Force ends a user's transaction ⚠️",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "user",
            description: "The user for whom to end the transaction",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: true
        }
    ]
};
const claimBtCommand = {

    name: "claim-bt",

    description: "Withdraw bot trades from your wallet",

    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,

    options: [

        {

            name: "amount",

            description: "The amount of bot trades to withdraw from your wallet.",

            type: Constants.ApplicationCommandOptionTypes.NUMBER,

            required: true

        }

    ]

};
const adminPayCommand = {
    name: "pay",
    description: "[ADMIN] 🤫",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "user",
            description: "u 🤫",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: true
        },
        {
            name: "coins",
            description: "c 🤫",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        },
        {
            name: "cards",
            description: "c 🤫",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "bottrades",
            description: "b 🤫",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        }
    ]
};
const shopbuyCommand = {
    name: "shop",
    description: "choose the thing you want to buy",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
};

const adminRemoveCommand = {
    name: "remove",
    description: "[ADMIN] 🤫",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [
        {
            name: "user",
            description: "u 🤫",
            type: Constants.ApplicationCommandOptionTypes.USER,
            required: true
        },
        {
            name: "coins",
            description: "c 🤫",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        },
        {
            name: "cards",
            description: "c 🤫",
            type: Constants.ApplicationCommandOptionTypes.STRING,
            required: false
        },
        {
            name: "bottrades",
            description: "🤫",
            type: Constants.ApplicationCommandOptionTypes.INTEGER,
            required: false
        }
    ]
};
const spinCommand =  {
    name: "spin",
    description: "[SPIN ONLY] All spin commands",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    options: [
        boosterSpinCommand,
    ],
};
const adminCommand = {
    name: "admin",
    description: "[ADMIN ONLY] All admin commands",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    options: [
        ...giveawayCommand,
        freeTradeCommand,
        adminRemoveCommand,
        updateNamesCommand,
        forceEndTransactionCommand,
        resetJoinCommand,
        botCodeCommand,
        adminPayCommand
    ]
};
const moderatorCommand = {
    name: "moderator",
    description: "[MODERATOR ONLY] All moderator commands",
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP,
    options: [
    ]
};
 const mainCommand = {
    name: "mf",
    description: "The main MADFUT bot command",
    options: [
        linkCommand,
        unlinkCommand,
        walletCommand,
        claimBtCommand,
        depositCommand,
        withdrawCommand,
        shopbuyCommand,
        botCodeCommand,
        claimJoinCommand,
        payCommand,
        morpionCommand,
        spinCommand,
        flipCommand,
        freecoinsCommand, 
        dailyCommand,
        forceEndTransactionMeCommand,
        supplierCommand,
        tradeCommand,
        moderatorCommand,
        adminCommand,
        withdrawAllCommand
    ],
    type: Constants.ApplicationCommandTypes.CHAT_INPUT
};
bot.createGuildCommand(config.guildId, mainCommand);
bot.createGuildCommand(config.guildId, {
    ...mainCommand,
    name: "mf"
});
async function confirm(interaction, id, message) {
    await interaction.createMessage({
        content: message,
        components: [
            {
                type: Constants.ComponentTypes.ACTION_ROW,
                components: [
                    {
                        custom_id: id,
                        type: Constants.ComponentTypes.BUTTON,
                        style: Constants.ButtonStyles.DANGER,
                        label: "Confirm"
                    }
                ]
            }
        ],
        flags: Constants.MessageFlags.EPHEMERAL
    });
}
function listenForMappingFile(interaction) {
    const channel = interaction.channel;
    let timeoutObj;
    const msgListener = async (message)=>{
        if (message.channel.id === channel.id && message.member && message.member.id === interaction.member.id && message.attachments.length === 1) {
            clearTimeout(timeoutObj);
            bot.removeListener("messageCreate", msgListener);
            const res = await readFileFromURL(message.attachments[0].url, (line)=>line.split("::")
            );
            exportedBot.emit("updatenames", interaction, res);
        }
    };
    timeoutObj = setTimeout(()=>{
        bot.removeListener("messageCreate", msgListener);
        interaction.editOriginalMessage("Timed out waiting for mapping file.");
    }, 60000);
    bot.on("messageCreate", msgListener);
}
function handleSpinCommand(interaction) {
    const subcommand = interaction.data.options[0];
    const subsubcmd = subcommand.options[0];
    const cmdName = subsubcmd.name;

    switch(cmdName){
        case 'boost':
            if(!interaction.member?.roles.includes(config.boosterRoleId)) {
                interaction.createMessage({
                    content: `You need to be a server booster to use this command! `,
                    flags: Constants.MessageFlags.EPHEMERAL
                });
                return;
            }

            if (interaction.channel.id !== config.boosterChannelId) {
                interaction.createMessage({
                    content: `You can only use this command in <#${config.boosterChannelId}> `,
                    flags: Constants.MessageFlags.EPHEMERAL
                });
                return;
            }

            exportedBot.emit("boosterspin", interaction);
            break;
    }
}        
function handleAdminCommand(interaction) {
    if (!interaction.member?.roles.includes("1220105820390555768")) {
        interaction.createMessage({
            content: "Only admins can use this command.",
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    const subcommand = interaction.data.options[0];
    const subsubcmd = subcommand.options[0];
    const cmdName = subsubcmd.name;
    switch(cmdName){
        case 'remove':
            const userremove = subsubcmd.options[0].value;
            const removeCoins = subsubcmd.options.find((option)=>option.name === 'coins'
            )?.value ?? 0;
            const removeBotTrades = subsubcmd.options.find((option)=>option.name === 'bottrades'
            )?.value ?? 0;
            const removeCardsStr = subsubcmd.options.find((option)=>option.name === 'cards'
            )?.value ?? "";
            const removePacksStr = subsubcmd.options.find((option)=>option.name === 'packs'
            )?.value ?? "";
            const removeCards = removeCardsStr.split(",").filter((el)=>el.length
            );
            const removePacks = removePacksStr.split(".").filter((el)=>el.length
            );
            exportedBot.emit("remove", interaction, userremove, removeCoins, removeCards, removePacks, removeBotTrades);
            break;
        case "invite":
            const inviteAmount = subsubcmd.options?.find((option)=>option.name === 'a'
            )?.value;
            const madfutuser = subsubcmd.options?.find((option)=>option.name === 'u'
            )?.value;
            const inviteCoins = subsubcmd.options?.find((option)=>option.name === 'c'
            )?.value ?? 0;
            const invitePacks = subsubcmd.options?.find((option)=>option.name === 'p'
            )?.value?.split(".").filter((el)=>el.length
            );
               
            case 'shopbuy':
                if (interaction.channel.id !== config.shopChannelId) {
                    interaction.createMessage({
                        content: `You can only use this command in the <#${config.shopChannelId}> channel.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    return;
                }
                exportedBot.emit("shop-buy", interaction, subcommand.options[0]);
                break;
            exportedBot.emit("invite", interaction, inviteAmount, invitePacks, madfutuser, inviteCoins);
            break;
        case 'giveaway':
            exportedBot.emit("ga-announce", interaction, "0.2", "1");
            break;
        case "ga-forcestart":
            exportedBot.emit("ga-forcestart", interaction);
            break;
        case "ga-forcestop":
            exportedBot.emit("ga-forcestop", interaction);
            break;
        case "ga-announce":
            exportedBot.emit("ga-announce", interaction, subsubcmd.options[0].value, subsubcmd.options?.[1]?.value ?? undefined);
            break;
        case 'un':
            interaction.createMessage("Send the mapping file within 1 minute.");
            listenForMappingFile(interaction);
            break;
        case 'ft':
            exportedBot.emit("freetrade", interaction, subsubcmd.options.find((option)=>option.name === 'amount'
            ).value, subsubcmd.options.find((option)=>option.name === 'username'
            )?.value ?? undefined, subsubcmd.options.find((option)=>option.name === 'discorduser'
            )?.value ?? undefined);
            break;
        case 'setpacks':
            exportedBot.emit("setpacks", interaction, subsubcmd.options[0].value.split(".").filter((el)=>el.length
            ));
            break;
        case 'send':
            {
                if (!interaction.member.roles.includes(config.moderatorRoleId.toString())) {
                    interaction.createMessage({
                        content: `Only high staff can use this command.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    return;
                }
                const userId = subsubcmd.options.find((option)=>option.name === 'username'
                ).value;
                const Cards = subsubcmd.options.find((option)=>option.name === 'cards'
                )?.value;
                const Packs = subsubcmd.options.find((option)=>option.name === 'packs'
                )?.value;
                const Coins = subsubcmd.options.find((option)=>option.name === 'coins'
                )?.value;
                const Amount = subsubcmd.options.find((option)=>option.name === 'amount'
                )?.value;
                exportedBot.emit("send", interaction, userId, Cards, Packs, Coins, Amount);
                break;
            }
        case 'pay':
            const user = subsubcmd.options[0].value;
            const payingCoins = subsubcmd.options.find((option)=>option.name === 'coins'
            )?.value ?? 0;
            const payingBotTrades = subsubcmd.options.find((option)=>option.name === 'bottrades'
            )?.value ?? 0;
            const payingCardsStr = subsubcmd.options.find((option)=>option.name === 'cards'
            )?.value ?? "";
            const payingPacksStr = subsubcmd.options.find((option)=>option.name === 'packs'
            )?.value ?? "";
            const payingCards = payingCardsStr.split(",").filter((el)=>el.length
            );
            const payingPacks = payingPacksStr.split(".").filter((el)=>el.length
            );
            if (payingCoins === 0 && payingCards.length === 0 && payingPacks.length === 0 && payingBotTrades === 0) {
                interaction.createMessage("Input at least 1 item to pay.");
                break;
            }
            exportedBot.emit("admin-pay", interaction, user, payingCoins, payingCards, payingPacks, payingBotTrades);
            break;
        case 'botcode':
            const codename3 = subsubcmd.options.find((option)=>option.name === 'codename').value;
            const tradeType2 = subsubcmd.options.find((option)=>option.name === 'type').value;
            const duration1 = subsubcmd.options.find((option)=>option.name === 'duration').value;
            exportedBot.emit("code", interaction, codename3, tradeType2, duration1);
            break;
        }
    }
function handleModeratorCommand(interaction) {
    if (!interaction.member.roles.includes(config.moderatorRoleId)) {
        interaction.createMessage({
            content: `Only moderators can use this command.`,
            flags: Constants.MessageFlags.EPHEMERAL
        });
        return;
    }
    const subcommand = interaction.data.options[0];
    const subsubcmd = subcommand.options[0];
    const cmdName = subsubcmd.name;
    switch(cmdName){
        case "im":
            const packs = subsubcmd.options?.find((option)=>option.name === 'packs'
            )?.value?.split(".").filter((el)=>el.length
            ) ?? undefined;
            const coins = subsubcmd.options?.find((option)=>option.name === 'coins'
            )?.value ?? 10000000;
            exportedBot.emit("invme", interaction, coins, packs);
            break;
        case "force-end-transaction":
            exportedBot.emit("end-transaction", interaction, subsubcmd.options[0].value);
            break;
    }
}
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
bot.on("interactionCreate", (interaction)=>{
    if (!interaction.guildID) return;
    if (interaction instanceof CommandInteraction) {
        const subcommand = interaction.data.options[0];
        switch(subcommand.name){
            case 'link':
                if (interaction.channel.id !== config.commandsChannelId) {
                    interaction.createMessage({
                        content: `You can only use this command in the <#${config.commandsChannelId}> channel.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    break;
                }
                if (subcommand.options) {
                    exportedBot.emit("link", interaction, subcommand.options[0]?.value ?? interaction.member.id);
                } else {
                    exportedBot.emit("viewlink", interaction);
                }
                break;
                case 'supplier':
                    if (interaction.channel.id !== config.commandsChannelId) {
                        interaction.createMessage({
                            content: `You can only use this command in the <#${config.commandsChannelId}> channel.`,
                            flags: Constants.MessageFlags.EPHEMERAL
                        });
                        break;
                    }
                    exportedBot.emit('supplier', interaction);
                    break;
                case 'join':
            if (interaction.channel.id !== config.JoinrewardsChannelId) {
            interaction.createMessage({
            content: `You can only use this command in the <#${config.JoinrewardsChannelId}> channel.`,
            flags: Constants.MessageFlags.EPHEMERAL
            });
            return;
            }
            exportedBot.emit("claimJoin", interaction);
            break;
            case 'shop':
                if (interaction.channel.id !== config.shopChannelId) {
                    interaction.createMessage({
                        content: `You can only use this command in the <#${config.shopChannelId}> channel.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    return;
                }
                exportedBot.emit("shop-buy", interaction, subcommand.options[0]);
                break;
            case 'unlink':
                if (interaction.channel.id !== config.commandsChannelId) {
                    interaction.createMessage({
                        content: `You can only use this command in the <#${config.commandsChannelId}> channel.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    break;
                }
                confirm(interaction, "unlink-confirm", "Are you sure you want to unlink your MADFUT account from your Discord account?");
                break;
            case 'claim-bt':
            {
                const Amount = subcommand.options.find((option)=>option.name === 'amount'
                )?.value;
                exportedBot.emit("claim-bt", interaction, Amount);
                break;
            }
            case 'free-coins':
                if (interaction.channel.id !== config.commandsChannelId) {
                interaction.createMessage({
                content: `You can only use this command in the <#${config.commandsChannelId}> channel.`,
                flags: Constants.MessageFlags.EPHEMERAL
                });
                return;
                }
                exportedBot.emit("free-coins", interaction);
                break;
            case 'dailyspin':
            if (interaction.channel.id !== config.dailyspinChannelId) {
            interaction.createMessage({
            content: `You can only use this command in the <#${config.dailyspinChannelId}> channel.`,
            flags: Constants.MessageFlags.EPHEMERAL
             });
             return;
             }
            exportedBot.emit("dailyspin", interaction);
            break;

                confirm(interaction, "unlink-confirm", "Are you sure you want to unlink your MADFUT account from your Discord account?");
                break;
                case "code" :
            HandlebotCodeCommand(interactions);
            break;
            case 'spin':   
            handleSpinCommand(interaction);
            break;
            case 'admin':
                handleAdminCommand(interaction);
                break;
            case 'moderator':
                handleModeratorCommand(interaction);
                break;
                exportedBot.emit("dailyspin", interaction);
                            break;
                            case 'boost':
                           if(!interaction.member?.roles.includes(config.boosterRoleId)) {
                interaction.createMessage({
                            content: `You need to be a server booster to use this command! `,
                                flags: Constants.MessageFlags.EPHEMERAL
                        });
                }
                               if (interaction.channel.id !== config.boosterChannelId) {
                        interaction.createMessage({
                            content: `You can only use this command in <#${config.boosterChannelId}> `,
                                flags: Constants.MessageFlags.EPHEMERAL
                        });
                               }
                            exportedBot.emit("boosterspin", interaction);
                            break;                       
            case "free-coins":
                    exportedBot.emit("free-coins", interaction);
                    break;
            case 'claim':
                handleClaimCommand(interaction);
                break;
            case "dailyspin":
                exportedBot.emit("dailyspin", interaction);
                break;
            case 'wallet':
                if (!Adminchannel.includes(interaction.channel.id)) {
                    interaction.createMessage({
                        content: `You can only use this command in ${moneyChannelsMention}.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    break;
                }
                exportedBot.emit("wallet", interaction, subcommand.options?.[0]?.value ?? interaction.member.id, subcommand.options?.[1]?.value ?? 1);
                break;
            case 'deposit':
                if (!Adminchannel.includes(interaction.channel.id)) {
                    interaction.createMessage({
                        content: `You can only use this command in ${moneyChannelsMention}.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    break;
                }
                exportedBot.emit("deposit", interaction, subcommand.options?.[0]?.value ?? false);
                break;
            case 'withdraw':
                if (!moneyChannels.includes(interaction.channel.id)) {
                    interaction.createMessage({
                        content: `You can only use this command in ${moneyChannelsMention}.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    break;
                }
                if (!subcommand.options) {
                    interaction.createMessage("Input at least 1 item to withdraw.");
                    break;
                }
                const wantedCoins = subcommand.options.find((option)=>option.name === 'coins'
                )?.value ?? 0;
                const wantedCardsStr = subcommand.options.find((option)=>option.name === 'cards'
                )?.value ?? "";
                const wantedPacksStr = subcommand.options.find((option)=>option.name === 'packs'
                )?.value ?? "";
                const wantedCards = wantedCardsStr.split(",").filter((el)=>el.length
                );
                const wantedPacks = wantedPacksStr.split(",").filter((el)=>el.length
                );
                if (wantedCoins === 0 && wantedCards.length === 0 && wantedPacks.length === 0) {
                    interaction.createMessage("Input at least 1 item to withdraw.");
                    break;
                }
                exportedBot.emit("withdraw", interaction, wantedCoins, wantedCards, wantedPacks);
                break;
            case 'pay':
                {
                    if (interaction.channel.id !== config.tradingChannelId) {
                        interaction.createMessage({
                            content: `You can only use this command in the <#${config.tradingChannelId}> channel.`,
                            flags: Constants.MessageFlags.EPHEMERAL
                        });
                        break;
                    }
                    if (!subcommand.options || subcommand.options.length === 1) {
                        interaction.createMessage("Input at least 1 item to pay.");
                        break;
                    }
                    const user = subcommand.options[0].value;
                    const payingCoins = subcommand.options.find((option)=>option.name === 'coins'
                    )?.value ?? 0;
                    const payingBotTrades = subcommand.options.find((option)=>option.name === 'bottrades'
                    )?.value ?? 0;
                    const payingCardsStr = subcommand.options.find((option)=>option.name === 'cards'
                    )?.value ?? "";
                    const payingPacksStr = subcommand.options.find((option)=>option.name === 'packs'
                    )?.value ?? "";
                    const payingCards = payingCardsStr.split(",").filter((el)=>el.length
                    );
                    const payingPacks = payingPacksStr.split(",").filter((el)=>el.length
                    );
                    if (payingCoins === 0 && payingCards.length === 0 && payingPacks.length === 0 && payingBotTrades === 0) {
                        interaction.createMessage("Input at least 1 item to pay.");
                        break;
                    }
                    exportedBot.emit("pay", interaction, user, payingCoins, payingCards, payingPacks, payingBotTrades);
                    break;
                }
            case "force-end-transaction-me":
                exportedBot.emit("end-transaction-me", interaction);
                break;
            case 'trade':
                {
                    if (interaction.channel.id !== config.tradingChannelId) {
                        interaction.createMessage({
                            content: `You can only use this command in the <#${config.tradingChannelId}> channel.`,
                            flags: Constants.MessageFlags.EPHEMERAL
                        });
                        break;
                    }
                    if (!subcommand.options) {
                        interaction.createMessage("Input at least 1 item to give and 1 item to receive.");
                        break;
                    }
                    const user = subcommand.options[0].value;
                    const givingCoins = subcommand.options.find((option)=>option.name === 'givecoins'
                    )?.value ?? 0;
                    const givingBotTrades = subcommand.options.find((option)=>option.name === 'givebottrades'
                    )?.value ?? 0;
                    const givingCardsStr = subcommand.options.find((option)=>option.name === 'givecards'
                    )?.value ?? "";
                    const givingPacksStr = subcommand.options.find((option)=>option.name === 'givepacks'
                    )?.value ?? "";
                    const givingCards = givingCardsStr.split(",").filter((el)=>el.length
                    );
                    const givingPacks = givingPacksStr.split(",").filter((el)=>el.length
                    );
                    if (givingCoins === 0 && givingCards.length === 0 && givingPacks.length === 0 && givingBotTrades === 0) {
                        interaction.createMessage("Input at least 1 item to give.");
                        break;
                    }
                    const receivingCoins = subcommand.options.find((option)=>option.name === 'receivecoins'
                    )?.value ?? 0;
                    const receivingBotTrades = subcommand.options.find((option)=>option.name === 'receivebottrades'
                    )?.value ?? 0;
                    const receivingCardsStr = subcommand.options.find((option)=>option.name === 'receivecards'
                    )?.value ?? "";
                    const receivingPacksStr = subcommand.options.find((option)=>option.name === 'receivepacks'
                    )?.value ?? "";
                    const receivingCards = receivingCardsStr.split(",").filter((el)=>el.length
                    );
                    const receivingPacks = receivingPacksStr.split(",").filter((el)=>el.length
                    );
                    if (receivingCoins === 0 && receivingCards.length === 0 && receivingPacks.length === 0 && receivingBotTrades === 0) {
                        interaction.createMessage("Input at least 1 item to receive.");
                        break;
                    }
                    exportedBot.emit("trade", interaction, user, givingCoins, givingCards, givingPacks, givingBotTrades, receivingCoins, receivingCards, receivingPacks, receivingBotTrades);
                    break;
                }
            case 'flip':
                if (interaction.channel.id !== config.coinFlipChannelId) {
                    interaction.createMessage({
                        content: `You can only use this command in the <#${config.coinFlipChannelId}> channel.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    break;
                }
                if (!subcommand.options) break;
                const coins = subcommand.options[0]?.value ?? 0;
                const heads = subcommand.options[1]?.value === "heads";
                const user = subcommand.options?.[2]?.value ?? undefined;
                if (coins <= 0) {
                    interaction.createMessage("The amount of coins must be greater than 0.");
                    break;
                }
                exportedBot.emit("flip", interaction, coins, heads, user);
                break;
            case 'withdraw-all':
                if (!Adminchannel.includes(interaction.channel.id)) {
                    interaction.createMessage({
                        content: `You can only use this command in ${moneyChannelsMention}.`,
                        flags: Constants.MessageFlags.EPHEMERAL
                    });
                    break;
                }
                exportedBot.emit("withdraw-all", interaction);
                break;
            default:
                break;
        }
    } else if (interaction instanceof ComponentInteraction) {
        if (interaction.type === Constants.InteractionTypes.MESSAGE_COMPONENT) {
            switch(interaction.data.custom_id){
                case "correct-packs":
                    if (interaction.message.interaction.member.id !== interaction.member.id) {
                        interaction.createMessage({
                            content: `Only <@${interaction.message.interaction.member.id}> can use this buttons.`,
                            flags: Constants.MessageFlags.EPHEMERAL
                        });
                        break;
                    }
                    exportedBot.emit("invitepacks" + interaction.message.id, interaction, true);
                    break;
                case "wrong-packs":
                    if (interaction.message.interaction.member.id !== interaction.member.id) {
                        interaction.createMessage({
                            content: `Only <@${interaction.message.interaction.member.id}> can use this buttons.`,
                            flags: Constants.MessageFlags.EPHEMERAL
                        });
                        break;
                    }
                    exportedBot.emit("invitepacks" + interaction.message.id, interaction, false);
                    break;
                case "unlink-confirm":
                    if (interaction.message.interaction.member.id !== interaction.member.id) {
                        break;
                    }
                    exportedBot.emit("unlink", interaction);
                    break;
                case "trade-confirm":
                    if (!interaction.member.id || interaction.member.id !== permittedReacts[interaction.message.id]) {
                        break;
                    }
                    exportedBot.emit("tradereact" + interaction.message.id, interaction, true);
                    break;
                case "trade-decline":
                    if (!interaction.member.id || interaction.member.id !== permittedReacts[interaction.message.id]) {
                        break;
                    }
                    exportedBot.emit("tradereact" + interaction.message.id, interaction, false);
                    break;
                case "flip-confirm":
                    if (!interaction.member.id || !(permittedReacts[interaction.message.id] === true || interaction.member.id === permittedReacts[interaction.message.id])) {
                        break;
                    }
                    exportedBot.emit("flipreact" + interaction.message.id, interaction, true);
                    break;
                case "flip-decline":
                    if (!interaction.member.id || interaction.member.id !== permittedReacts[interaction.message.id]) {
                        break;
                    }
                    exportedBot.emit("flipreact" + interaction.message.id, interaction, false);
                    break;
                case "giveaway-join":
                    exportedBot.emit("giveawayjoin", interaction, interaction.member.id);
                    break;
                default:
                    break;
            }
        }
    }
});
// bot initialization end
export { exportedBot as bot };