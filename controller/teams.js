import {openDb} from '../configDB.js';

export async function createTeamsTable() {
    openDb().then(db=>{
        db.exec('CREATE TABLE IF NOT EXISTS Teams (id INTEGER PRIMARY KEY, name TEXT, region TEXT, link TEXT) ')
    })
}



export async function insertTeam(team) {
    insertionQueue.push(team);

    if (!isInserting) {
        processQueue();
    }
}

async function processQueue() {
    isInserting = true;

    while (insertionQueue.length > 0) {
        const team = insertionQueue.shift();
        try {
            const db = await openDb();

            const existingTeam = await db.get('SELECT * FROM Teams WHERE name = ? OR link = ?', [team.name, team.link]);

            if (!existingTeam) {
                await db.run('INSERT INTO Teams (name, region, link) VALUES (?, ?, ?)', [team.name, team.region, team.link]);
                console.log('New team successfully inserted:', team.name);
            } else {
            }

        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }

    isInserting = false;
}


export async function deleteAllTeams(Teams) {
    openDb().then(db=>{
        db.run('DELETE FROM Teams; DELETE FROM sqlite_sequence WHERE name=\'Teams\';');
        console.log('All data has been deleted from the table, and the sequence has been reset.');
    })
}


export async function getAllLinks(array) {
    try {
        const db = await openDb();
        const links = await db.all('SELECT link FROM Teams');

        if (links.length > 0) {
            links.forEach(linkObj => {
                //console.log(linkObj.link);
                 array.push(linkObj.link)
            });
        } else {
            console.log('No links found in the Teams table.');
        }
    } catch (error) {
        console.error('Error fetching links:', error);
    }
}
