import io from'socket.io-client';

const { origin } = window.location;
let isStarted = false;

let automagic = {
    baseUri: 'Scripts/',
    port: 3912,
	fileChanged: 'fileChanged',
};

automagic.init = () => {        
    if (isStarted) { 
        console.error('automagic has already been initialised - ensure that \'automagic.init() is not part of a file being reloaded\'');
        return;
    }

    isStarted = true;
    var socket = io(`//localhost:${automagic.port}`, { secure: true });
 
    socket.on(automagic.fileChanged, function(e) {
        let doneList = [];
        refresh(e.fileName, doneList);
    });

}

const getFullyQualifiedName = (fileName) => {
    return `${origin}/${automagic.baseUri}${fileName}`;
};

function refresh(fileName, doneList) {
    const fullyQualifiedName = getFullyQualifiedName(fileName);
  
    //prevent circular references
    if (doneList.includes(fullyQualifiedName)) {
        return;
    }

    if (System.has(fullyQualifiedName)) {
        System.delete(fullyQualifiedName);
    }
    System.import(`${automagic.baseUri}${fileName}`);
    doneList = [...doneList, fullyQualifiedName];

    const next = getNextDependent(fileName, doneList);
    if (next) {
        refresh(next, doneList);
    }

}

//TODO: turn into a generator
function getNextDependent(fileName, doneList) {
    const dependencyName = `${automagic.baseUri}${fileName}`;

    const keys = Object.keys(System.loads);   
    for(var i = 0; i < keys.length; i++) {
        const loaded = System.loads[keys[i]];
        const nextFileNameIndex = loaded.name.lastIndexOf('/') + 1;
        const nextFileName = loaded.name.substring(nextFileNameIndex);

        if (loaded.deps.includes(dependencyName) && 
            !doneList.includes(nextFileName)) {
            return nextFileName;
        }
   
    }
    return null;
}


export default automagic;
