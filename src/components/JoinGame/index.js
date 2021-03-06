import React from 'react'
import { 
  compose,
  withState,
  withHandlers
} from 'recompose'

import {
  ScreenBody,
  Screen,
  ScreenFooter
} from '../screen'

import ExpandoButton from '../ExpandoButton'
import CreateGameButton from '../CreateGame'

import './index.css'

const enhance = compose(
  withState('gameCode', 'setGameCode', ''),
  withState('userName', 'setUserName', ''),
  withHandlers({
    onGameCodeChange: props => event => {
      props.setGameCode(event.target.value);
    },
    onUserNameChange: props => event => {
      props.setUserName(event.target.value);
    }
  })
)

const JoinGame = ({gameCode, userName, onGameCodeChange, onUserNameChange}) => (
  <Screen>
    <ScreenBody className={'JoinGame-container'} bottomBar>
      <div style={{margin: '0 auto', textAlign: 'center'}}>
        <span className={'JoinGame-gameCodeLabel'}>Game Code:</span>
        <input id='gameCode' name='gameCode' type='gameCode' value={gameCode} maxLength='4' className={'JoinGame-gameCode'} onChange={onGameCodeChange}></input>
      </div>

      <div style={{margin: '0 auto', textAlign: 'center'}}>
        <span className={'JoinGame-userNameLabel'}>User Name:</span>
        <input id='userName' name='userName' type='userName' value={userName} maxLength='24' className={'JoinGame-userName'} onChange={onUserNameChange}></input>
      </div>
    </ScreenBody>
    <ScreenFooter>
      
      <ExpandoButton to={`join/${gameCode}/${userName}`} disabled={!(userName && gameCode)}>
        Join!
      </ExpandoButton>
    </ScreenFooter>
    <div style={{position: 'absolute', bottom: '10vh', right: '7vw'}}>
      <CreateGameButton to={'manage'}/>
    </div>
  </Screen>
);

export default enhance(JoinGame)
