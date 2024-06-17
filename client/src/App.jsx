import './App.css';
import Create_join from './Create_join';
import Join from './Join';
import Lobby from './Lobby';
import Found from './Found';
import Game from './Game';
import Ready from './Ready';
import Result from './Result';



function App({socket,name,next}) {
  fetch('/api')
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  return (
    <div className="App">
      <Create_join name={name} socket={socket}/>
    </div>
  );
}

export default App;
