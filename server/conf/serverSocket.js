const socketIO = require('socket.io');
const custom_lobbies = [];
let next_custom=0;

class lobby {
    constructor(p1,p1_id) {
        this.p1=p1;
        this.p2="temp";
        this.p1_choice="temp";
        this.p2_choice="temp";
        this.p1_id=p1_id;
        this.p2_id="temp";
        this.outcome=7;
        this.lobby_id = -1;
        this.started = false;
        this.finished=false;
        this.ready_count=0;
        this.plays=0;
        this.players=1;
    }
}

function code_gen(number) {
    let base36String = number.toString(36);
    const fixedPattern = 'uniqueid';
    const combinedString = fixedPattern + base36String;
    const paddedString = combinedString.slice(-8);

    return paddedString;
}
function algo(p1,p2){
    console.log("squeeze");
    console.log(p1);
    console.log(p2);
    console.log("theorem");
    if (p1==p2){
        return 0;
    }
    if (p1=="rock" && p2=="scissors"){
        return 1;
    }
    if (p2=="rock" && p1=="scissors"){
        return 2;
    }
    if (p1.length>p2.length){
        return 1;
    }
    if (p2.length>p1.length){
        return 2;
    }
    
    return 3;
}

function configureSocketIO(server) {
    const io = socketIO(server);
    
    io.on('connection', (socket) => {
        console.log('User connected');
        io.to(socket.id).emit("identity",{connected:"connection successful"});

        //#################################################################
        //setup stuff
        socket.on("create",(data)=>{
            console.log("creating");
            //username
            let some = new lobby(data.username,socket.id);
            some.lobby_id=code_gen(next_custom);
            next_custom++;
            custom_lobbies.push(some);
            io.to(socket.id).emit("create-res",{id:some.lobby_id});
        });

        socket.on("join",(data)=>{
            //username, id
            console.log("joining");
            const index = custom_lobbies.findIndex(car => car.lobby_id == data.id);
            if (index==-1){
                console.log("not found");
                console.log(data);
                io.to(socket.id).emit("not-found");
            }
            else{
                io.to(custom_lobbies[index].p1_id).emit("opponent",{name:data.username,identity:data.id});
                io.to(socket.id).emit("opponent",{name:custom_lobbies[index].p1,identity:data.id});
                custom_lobbies[index].p2=data.username;
                custom_lobbies[index].p2_id=socket.id;
                custom_lobbies[index].players++;
            }
        });
        socket.on("ready",(data)=>{
            //username,id
            const index = custom_lobbies.findIndex(car => car.lobby_id==data.id);
            console.log(index);
            if (index==-1){
                return;
            }
            custom_lobbies[index].ready_count++;
            io.to(custom_lobbies[index].p1_id).emit("readyy",{name:data.username});
            io.to(custom_lobbies[index].p2_id).emit("readyy",{name:data.username});
            
            if (custom_lobbies[index].ready_count==2){
                console.log("starting");
                io.to(custom_lobbies[index].p1_id).emit("start-match");
                io.to(custom_lobbies[index].p2_id).emit("start-match");
            }
        });
        socket.on("not-ready",(data)=>{
            //username,id
            const index = custom_lobbies.findIndex(car => car.lobby_id==data.id);
            console.log(index);
            if (index==-1){
                return;
            }
            custom_lobbies[index].ready_count--;
            io.to(custom_lobbies[index].p1_id).emit("unready",{name:data.username});
            io.to(custom_lobbies[index].p2_id).emit("unready",{name:data.username});
        });

        //#################################################################
        //playing stuff
        
        socket.on("play",(data)=>{
            //username,id,play
            const index = custom_lobbies.findIndex(car => car.lobby_id==data.id);
            console.log(index);
            if (index==-1){
                return;
            }
            custom_lobbies[index].plays++;
            if (custom_lobbies[index].p1==data.username){
                custom_lobbies[index].p1_choice=data.play;
            }
            else{
                custom_lobbies[index].p2_choice=data.play;
            }
            if (custom_lobbies[index].plays==2){
                let outcome=algo(custom_lobbies[index].p1_choice,custom_lobbies[index].p2_choice);
                custom_lobbies[index].outcome=outcome;
                if (outcome==0){
                    io.to(custom_lobbies[index].p1_id).emit("tie",{p1:custom_lobbies[index].p1_choice,p2:custom_lobbies[index].p2_choice});
                    io.to(custom_lobbies[index].p2_id).emit("tie",{p1:custom_lobbies[index].p1_choice,p2:custom_lobbies[index].p2_choice});
                }
                else if (outcome==1){
                    io.to(custom_lobbies[index].p1_id).emit("winner",{p1:custom_lobbies[index].p1_choice,p2:custom_lobbies[index].p2_choice});
                    io.to(custom_lobbies[index].p2_id).emit("loser",{p1:custom_lobbies[index].p1_choice,p2:custom_lobbies[index].p2_choice});
                }
                else if (outcome==2){
                    io.to(custom_lobbies[index].p1_id).emit("loser",{p1:custom_lobbies[index].p1_choice,p2:custom_lobbies[index].p2_choice});
                    io.to(custom_lobbies[index].p2_id).emit("winner",{p1:custom_lobbies[index].p1_choice,p2:custom_lobbies[index].p2_choice});
                }
                else{
                    console.log("very very odd");
                }
            }
        });

        //#################################################################
        //connection stuff

        socket.on('disconnect', () => {
            console.log(`user disconnected:${socket.id}`);
            let h=-1;
            for (let i=0;i<custom_lobbies.length;i++){
                if (custom_lobbies[i].p1_id==socket.id){
                    custom_lobbies[i].p1_id="temp";
                    h=i;
                    if (custom_lobbies[i].p2_id!="temp"){
                        io.to(custom_lobbies[i].p2_id).emit("opp-lost",{name:custom_lobbies[i].p1});
                        custom_lobbies[i].players--;
                    }
                }
                else if (custom_lobbies[i].p2_id==socket.id){
                    custom_lobbies[i].p2_id="temp";
                    h=i;
                    if (custom_lobbies[i].p1_id!="temp"){
                        io.to(custom_lobbies[i].p1_id).emit("opp-lost",{name:custom_lobbies[i].p1});
                        custom_lobbies[i].players--;
                    }
                }
            }
            if (h!=-1){
                custom_lobbies.splice(h,1);
            }
        });
    });

    return io;
}

module.exports = configureSocketIO;