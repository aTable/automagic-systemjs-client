import io from'socket.io-client';

const { origin } = window.location;


let automagic = {
    baseUri: 'Scripts/',
    port: 3912
};

automagic.init = () => {
    var socket = io(`//localhost:${automagic.port}`, { secure: true });
    socket.on('fileChanged', function(e) {
        refreshModule(e);
    });
}



function getDependentModules(fileName) {
    Object.keys(System.loads).forEach(x => {
        let item = System.loads[x];
        let dependentIndex = item.deps.indexOf(`${automagic.baseUri}${fileName}`);
        if (dependentIndex >= 0) {
            console.log('affected module', dependentIndex);
            refreshModule(e);
        }
    });
}

function refreshModule(e) {
    let fullyQualifiedName = `${origin}/${automagic.baseUri}${e.fileName}`;
  
    if (System.has(fullyQualifiedName)) {
        System.delete(fullyQualifiedName);
    }
    System.import(`${automagic.baseUri}${e.fileName}`);
}

export default automagic;
