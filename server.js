const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const repl = require('repl');
const fs = require('fs');
const path = require('path');

const playersFilePath = path.join(__dirname, '/playersData.json');
const tokenFilePath = path.join(__dirname,'/tokenData.json');
const npcFilePath = path.join(__dirname,'/nps.json');
const pathFilePath = path.join(__dirname,'/overhead-path.json');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players, spectators = 0;
let npcs, coordinates;
loadPlayersData();
loadPathData();
loadNPCData();
let tokens;
loadTokenData();

const replServer = repl.start({
  prompt: '> ',
  useGlobal: true
});

replServer.context.players = players;
replServer.context.npcs = npcs;
replServer.context.updatestory = updateStory;
replServer.context.updatestoryall = updateStoryAll;
replServer.context.freemove = freeMove;
replServer.context.freemoveall = freeMoveAll;
replServer.context.whoseTurn = whoseTurn;
replServer.context.stopsaving = stopSaving;
replServer.context.startsaving = startSaving;
replServer.context.saveAll = saveAll;
replServer.context.stopSavingAll = stopSavingAll;
replServer.context.tiah2flame = tiamatH2Flame;
replServer.context.tiawingatk = tiamatWingAttack;
replServer.context.tiafalldown = tiamatFallDown;
replServer.context.chinvis = characterInvis;
replServer.context.chjumppos = characterJumpToPosition;
replServer.context.getup = getup;
replServer.context.cleartoclimb = clearToClimb;
replServer.context.playeraction = playerAction;
replServer.context.dbdstatus = dbdstatus;
replServer.context.canfly = canfly;
replServer.context.sd1status = sd1status;
replServer.context.sldstatus = sldstatus;
replServer.context.sld3status = sld3status;
replServer.context.sld4status = sld4status;
replServer.context.lockstatus = lockstatus;
replServer.context.plantbite = plantBite;
replServer.context.setAnim = setAnimation;
replServer.context.freezecheck = freezeCheck;
replServer.context.windresist = windResist;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

io.on('connection', (socket) => {
  const clientIp = socket.handshake.address;
  console.log('New client connected');
    // Log all events emitted by the server
    // const originalEmit = socket.emit;
    // socket.emit = function(...args) {
    //     console.log('Server emitting event:', args[0], 'with data:', args[1]);
    //     originalEmit.apply(socket, args);
    // };
    sendPath();
  socket.on('compareToken', (token) => {
    let result = -1;
    console.log('received token comparison request from: '+ clientIp);
    if (token == 'dAMIn') {
        result = 5;
    } 
    else {
    for (let i=1;i<=5;i++){
        if (token == tokens[i].token){
          result=1;
          }

    }}
console.log('result: ', result);
if (result==-1){
  spectators++;
}
    socket.emit('tokenComparisonResult', result);
});
socket.on('makeVicInvis',()=>{
  characterInvis('vic',true);
})
socket.on('requestplantbite',()=>{
  plantBite();
});
//Event to lockin player slot
socket.on('lockPlayer', (data) => {
  // Validate the number to ensure it's within range
  const { x, y, z, whichPlayer, name, isTurn, color, action, time, freezeSpot, direction, health, story, token,speed, invis } = data;
      const number = whichPlayer -1;
      // Update isLocked for the corresponding player (number-1 because array index starts from 0)
      players[number].x = x;
      players[number].y = y;
      players[number].z = z;
      players[number].name = name;
      players[number].isTurn = isTurn;
      players[number].color = color;
      
      players[number].direction = direction;
      players[number].speed = speed;
      players[number].action = action;
      players[number].time = time;
      players[number].health = health;
      players[number].freezeSpot = freezeSpot;
      players[number].story = story;
      players[number].token = token;

      players[number].invis = invis;
      players[number].isLocked = 1; // Assuming setting to 1 means locked
      console.log(`Player ${whichPlayer} is now locked.`, players[number].id);
      savePlayersData();
      // Emit updated player data to all clients if needed
  }   
);
// Event listener to get all players data


socket.on('nextTurn',(data) =>{
  console.log('passing from: '+data.from+' to '+data.next);
  whoseTurn(data.next-1);
})

socket.on('npcMovePos',(data)=>{
npcs[data.which].x = data.x;
npcs[data.which].y = data.y;
npcs[data.which].z = data.z;
npcs[data.which].direction = data.direction;

io.emit('moveNPC',data);
});
socket.on('updateNPCData',(data)=>{


if (data[0]){
  npcs[0].x = data[0].x;
  npcs[0].y = data[0].y;
  npcs[0].z = data[0].z;
  npcs[0].action = data[0].action;
  npcs[0].direction = data[0].direction;
  npcs[0].saveGame = data[0].saveGame;
  npcs[0].health = data[0].health;
  npcs[0].isTurn = data[0].isTurn;
  npcs[0].freeMove = data[0].freeMove;
}
  if (data[10]){
  npcs[10].x = data[10].x;
  npcs[10].y = data[10].y;
  npcs[10].z = data[10].z;
  npcs[10].action = data[10].action;
  npcs[10].direction = data[10].direction;
  npcs[10].saveGame = data[10].saveGame;
  npcs[10].health = data[10].health;
  npcs[10].isTurn = data[10].isTurn;
  npcs[10].freeMove = data[10].freeMove;
  }


  saveNPCData();
});

socket.on('bdastatus', (data)=>{

  io.emit('bdalarmstatus',data);

});

socket.on('spinbonestatus', (number)=>{
  io.emit('spinstatus', number);
})
socket.on('requestLivicData',()=>{
  const livicData = {
    health: npcs[1].health,
    direction: npcs[1].direction, 
    action: npcs[1].action,
    isTurn: npcs[1].isTurn,
    freeMove: npcs[1].freeMove,
    saveGame: npcs[1].saveGame,
    x: npcs[1].x,
    y: npcs[1].y,
    z: npcs[1].z

    
  }

  socket.emit('loadLivicData', livicData);

})

socket.on('playerMovePos', (data)=>{
  characterJumpToPosition(data.which, data.x, data.y, data.z);
});
socket.on('requestMedusaData',()=>{
  const medusaData = {
    health: npcs[2].health,
    direction: npcs[2].direction, 
    action: npcs[2].action,
    isTurn: npcs[2].isTurn,
    freeMove: npcs[2].freeMove,
    saveGame: npcs[2].saveGame,
    x: npcs[2].x,
    y: npcs[2].y,
    z: npcs[2].z

    
  }

  socket.emit('loadMedusaData', medusaData);

})

socket.on('requestPlayerData', () => {

    const playersAndNPCData = {
      players: players, 
      npcs: npcs
    }
    socket.emit('playerData', playersAndNPCData);
  });

socket.on('updateadminCamPos', (data)=>{
  players["admin"].x = data.x;
  players["admin"].y = data.y;
  players["admin"].z = data.z;
  players["admin"].direction = data.direction;

  savePlayersData();

});

//update position
socket.on('updatePlayerData', (data) => {
  
  //console.log('saving following data:'+whichPlayer);
  const playerIndex = data.whichPlayer - 1; // Adjust index to be 0-based
      
      players[playerIndex].x = data.x;
      players[playerIndex].y = data.y;
      players[playerIndex].direction = data.direction;
      players[playerIndex].z = data.z;
      players[playerIndex].canfly = data.canfly;
      players[playerIndex].isLocked = data.isLocked;
      players[playerIndex].isTurn = data.isTurn;
      players[playerIndex].speed = data.speed;
      players[playerIndex].flybar = data.flybar;
      players[playerIndex].windResist = data.windResist;
      players[playerIndex].name = data.name;
      players[playerIndex].color = data.color;
      players[playerIndex].action = data.action;
      players[playerIndex].time = data.time;
      players[playerIndex].health = data.health;
      players[playerIndex].freeMove = data.freeMove;
      players[playerIndex].story = data.story;
      players[playerIndex].hang = data.hang;
      players[playerIndex].freezeSpot = data.freezeSpot;
      players[playerIndex].token = data.token;
      players[playerIndex].tkn = data.token;
      players[playerIndex].saveGame = data.saveGame;
      players[playerIndex].invis = data.invis;

  //console.log(`Updated player ${whichPlayer} data`);
  savePlayersData();
});

socket.on('grabOtherPlayersData',(whichPlayer)=>{
const data = {players: players, npcs: npcs}
  socket.emit('sendingOtherPlayerData', data);
});

socket.on('getup',(number)=>{
  getup(number);
});

socket.on('elevatorMov',(data)=>{

console.log('elevator going '+data);

  io.emit('movelevator',data);

});



socket.on('touchstatus',(data)=>{
  console.log('how many: '+data.howManyTouches+', tstatus: '+data.touchstatus+', touch? '+data.touching+', d: '+data.directionx+', '+data.directiony);
})

socket.on('mobileanim',(data)=>{
  console.log(data);
})

socket.on('lock1', (number)=>{
  lockstatus(1,number);
});
socket.on('lock2', (number)=>{
  lockstatus(2,number);
});
socket.on('lock3', (number)=>{
  lockstatus(3,number);
});
socket.on('lock4', (number)=>{
  lockstatus(4,number);
});
socket.on('lock5', (number)=>{
  lockstatus(5,number);
});
socket.on('lock6', (number)=>{
  lockstatus(6,number);
});
socket.on('dbdstatus',(number)=>{
  io.emit('bdbstatus', number);
});

socket.on('sdstatus1',(number)=>{
  sd1status(number);
});

socket.on('sldstatus',(number)=>{
  sldstatus(number);
});

socket.on('sld3status',(number)=>{
  sld3status(number);
});

socket.on('sld4status',(number)=>{
  sld4status(number);
});
socket.on('disconnect', () => {
  console.log('A user disconnected:', clientIp);
  
  });

});
//Save players data when server shuts down
process.on('SIGINT', () => {
    process.exit();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'node_modules', 'socket.io', 'client-dist', 'socket.io.js'));
});
server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

function savePlayersData() {

  
  fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), (err) => {
      if (err) {
          console.error('Error saving players data:', err);
      } else {
          //console.log('Players data saved successfully.');
      }
  });
}

function saveNPCData() {


  fs.writeFile(npcFilePath, JSON.stringify(npcs, null, 2), (err) => {
      if (err) {
          console.error('Error saving npc data:', err);
      } else {
          //console.log('Players data saved successfully.');
      }
  });
}

function loadPlayersData() {
  if (fs.existsSync(playersFilePath)) {
      const data = fs.readFileSync(playersFilePath, 'utf8');
      players = JSON.parse(data);
      console.log('Players data loaded successfully.');
      
  } else {
      console.log('Players data file does not exist. Using default players data.');
  }
}

function loadNPCData(){
  if (fs.existsSync(npcFilePath)) {
    const data = fs.readFileSync(npcFilePath, 'utf8');
    npcs = JSON.parse(data);
    
} else {
    console.log('npc data file does not exist.');
}
}
function loadTokenData() {
  if (fs.existsSync(tokenFilePath)) {
      const data = fs.readFileSync(tokenFilePath, 'utf8');
      tokens = JSON.parse(data);
      console.log('Token data loaded successfully.');

  } else {
      console.log('Token data file does not exist. Using default players data.');
  }
}

function tiamatH2Flame(){
  console.log('tiamat commencing h2 fire.');
  io.emit('tiamath2flame');
}

function tiamatWingAttack(){
  console.log('tiamat commencing wing attack');
  io.emit('tiawingatk');
}
function updateStory(playerId, newStory) {
  if (players[playerId]) {
    players[playerId].story = newStory;
    savePlayersData();
    io.emit('storyUpdate', { playerId, newStory });
    console.log(`Story for player ${playerId} updated to ${newStory}`);
  } else {
    console.log(`Player with ID ${playerId} not found`);
  }
}

function updateStoryAll(newStory) {
  
    players[0].story = newStory;
    players[1].story = newStory;
    players[2].story = newStory;
    players[3].story = newStory;
    savePlayersData();
    io.emit('storyUpdateAll', newStory );
    console.log(`Story for all players updated to ${newStory}`);
  
}

function freeMove(which,val){
  const data = {
    which: which, val: val
  }
  players[which-1].freeMove = val;
  savePlayersData();
  io.emit('freeMove',data);
}

function freeMoveAll(val){
  players[0].freeMove = val;
  players[1].freeMove = val;
  players[2].freeMove = val;
  players[3].freeMove = val;
  savePlayersData();
  io.emit('freeMoveAll', val);
}

function whoseTurn(val){
  
    let which, ans;
    switch(val){
      case 1:
        players[0].freeMove = 0;
        players[0].isTurn = 1;
        players[1].isTurn = 0;
        players[2].isTurn = 0;
        players[3].isTurn = 0;
        break;
      case 2:
        players[1].freeMove = 0;
        players[0].isTurn = 0;
        players[1].isTurn = 1;
        players[2].isTurn = 0;
        players[3].isTurn = 0;
        break;
      case 3:
        players[2].freeMove = 0;
        players[0].isTurn = 0;
        players[1].isTurn = 0;
        players[2].isTurn = 1;
        players[3].isTurn = 0;
        break;
      case 4:
          players[3].freeMove = 0;
          players[0].isTurn = 0;
          players[1].isTurn = 0;
          players[2].isTurn = 0;
          players[3].isTurn = 1;
          break;
    }
    savePlayersData();
    io.emit('whoseTurn',(val));
  }
function stopSavingAll(){
  console.log('secured saving from all players');
  io.emit('stopSavingAll');
}

function saveAll(){
  console.log('resumed saving for all');
  io.emit('saveAll');
}
function stopSaving(which){
  console.log('Secured saving for Player '+which);
  io.emit('stopSavingPlayer', which);
}

function startSaving(which){
  console.log('resumed saving for Player '+which);
  io.emit('savePlayer', which);
}

function tiamatFallDown(){
  io.emit('tiamat falldown');
}

function characterInvis(whichPlay, boolean){
  let data;
  if (whichPlay=='vic')
  data = {
    which: 'vic',
    invis: boolean
  }
  if (whichPlay!='vic')
    data = {
      which: whichPlay,
      invis: boolean
    }
  if (boolean){
    console.log('turning player '+whichPlay+' invisible');
  }
  if (!boolean){
    console.log('breaking invis for player '+whichPlay);
  }


  io.emit('makeInvis', data);
}

function characterJumpToPosition(whichPlay, x, y,z){
  console.log('moving player '+whichPlay+' to position: '+x+','+y+','+z);
  data = {
    whichPlay: whichPlay,
    x: x, 
    y: y, 
    z: z
  }
  players[whichPlay-1].x = x;
  players[whichPlay-1].y = y;
  players[whichPlay-1].z = z;

  io.emit('jumpToPos', data);
}

function getup(which){
  console.log('picking up player '+which);
  io.emit('getup', which);
}

function clearToClimb(which){
  console.log('player '+which+' can climb higher now.');
  io.emit('clearToClimb', which);
}

function playerAction(which, string){
  let action = "";
  action+=string;
  console.log('setting player '+which+'to action: '+action);
  const data = { wp: which, action: action}
  io.emit('playeraction',data);

}

function setAnimation(wh, string){
  data = {which: wh, action: string}
  io.emit('updateAnimation',data);
}
function dbdstatus(number){
console.log('setting backdoor status: '+number);
io.emit('bdbstatus', number);
}



function sd1status(number){
  console.log('sliding door1 status: '+number);
  io.emit('sd1status', number);
}

function sldstatus(number){
  console.log('sliding door2 status: '+number);
  io.emit('lockerslidedoorstatus', number);
}

function sld3status(number){
  console.log('sliding door3 status: '+number);
  io.emit('slidingdoor3status', number);
}

function sld4status(number){
  console.log('sliding door4 status: '+number);
  io.emit('slidingdoor4status', number);
}

function lockstatus(number, stats){
  const data = {
    which: number,
    status: stats,
  }
  io.emit('lockstatus', data);
}

function plantBite(){
  console.log('plant goes to attack');
  io.emit('plantbite');
}

function loadPathData(){
  if (fs.existsSync(pathFilePath)) {
    const data = fs.readFileSync(pathFilePath, 'utf8');
    coordinates = JSON.parse(data);
    console.log('Overhead coords loaded.');
    
} else {
    console.log('Players data file does not exist. Using default players data.');
}
}

function sendPath(){
  console.log('sent overhead path coords');
  io.emit('overheadpath', coordinates);
}

function freezeCheck(whichPlayer, whichFreeze, status){
  data = {whichPlayer: whichPlayer, whichFreeze: whichFreeze, status: status}
  io.emit('freezecheck',data);
  if (status==1){
    freeMove(whichPlayer, 0);
  }
}

function canfly(whichPlayer, fly){
  data = {which: whichPlayer, fly: fly}
  console.log('Setting player '+whichPlayer+' fly status to '+fly);
  io.emit('canfly', data);
}

function windResist(whichPlayer, value){
data = {whichPlayer: whichPlayer, value: value}
console.log('setting player '+data.whichPlayer+' wind resist to '+data.value);
io.emit('windresist',data);
}