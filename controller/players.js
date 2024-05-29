import { openDb } from '../configDB.js'

export async function createPlayersTable() {
    openDb().then(db=> {
        db.exec('CREATE TABLE IF NOT EXISTS Players (id INTEGER PRIMARY KEY, nickname TEXT, name TEXT, link TEXT, team TEXT, FOREIGN KEY (team) REFERENCES Teams(name))')
    })
}

let isInserting = false;
const insertionQueue = [];

async function processQueue() {
    isInserting = true;

    while (insertionQueue.length > 0) {
        const player = insertionQueue.shift();
        try {
            const db = await openDb();

            const existingPlayer = await db.get('SELECT * FROM Players WHERE nickname = ? OR name = ? OR link = ? OR team = ?', [player.nickname, player.name, player.link, player.team]);

            if (!existingPlayer) {
                await db.run('INSERT INTO Players (nickname, name, link, team) VALUES (?, ?, ?, ?)', [player.nickname, player.name, player.link, player.team]);
                console.log('New player successfully inserted:', player.name);
            } else {
            }

        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }

    isInserting = false;
}

export async function insertPlayer(player) {
    insertionQueue.push(player);

    if (!isInserting) {
        processQueue();
    }
}

export async function deleteAllPlayers(Players) {
    openDb().then(db=>{
        db.run('DELETE FROM Players; DELETE FROM sqlite_sequence WHERE nickname=\'Teams\';');
        console.log('All data has been deleted from the table, and the sequence has been reset.');
    })
}