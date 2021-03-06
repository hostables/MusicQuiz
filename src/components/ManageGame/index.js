import React from 'react'
import {compose, lifecycle, withHandlers, withState} from 'recompose'

import {withDatabaseSubscribe, withLoading} from "../hocs"
import config from "../../config"
import SpotifyLoginComponent from "./SpotifyLoginComponent"
import FirebaseAuthLoading from "./FirebaseAuthLoading"
import database from "../../database";
import GameStartReadyScreen from '../GameStartReadyScreen'

const client_id = config.spotify.client_id
const redirect_uri = config.firebase.escaped_spotify_redirect_uri
const spotifyLoginUrl = `https://accounts.spotify.com/authorize/?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&scope=user-read-private%20user-read-email%20user-modify-playback-state&20user-read-currently-playing&20user-read-playback-state`


let childWindow = null

const enhance2RiseOfTheMachines = compose(
  withState('gameId', 'setGameId', ''),
  withLoading(
    (props) => (props.user === null),
    FirebaseAuthLoading
  ),
  lifecycle({
    componentWillMount() {
      const gameRef = database.ref('games').push()
      gameRef.set({
        is_started: false,
        owner_id: this.props.user.uid,
        players: {}
      })
      database.ref(`games-by-user/${this.props.user.uid}`).set({
        [gameRef.key]: true
      })
      this.props.setGameId(gameRef.key)
    }
  }),
)

const enhance = compose(
  withState('isLoginClicked', 'setLoginClicked', false),
  withState('hasToken', 'setHasToken', false),
  withState('token', 'setToken', {}),
  withState('game', 'setGame', {}),
  withHandlers({
    onClickLogin: props => event => {
      childWindow = window.open(spotifyLoginUrl + `&state=${props.user.uid}`, 'spotifyLogin')
    },
  }),
  withDatabaseSubscribe(
    'value',
    (props) => `users/${props.user.uid}/token`,
    (props) => (snapshot) => {
      if (snapshot.val() !== null && typeof snapshot.val() === 'object') {
        props.setHasToken(true)
        props.setToken(snapshot.val())
      }
      if (childWindow !== null) {
        childWindow.close()
      }
    }
  ),
  withLoading(
    (props) => (!props.hasToken),
    SpotifyLoginComponent
  ),
  withDatabaseSubscribe(
    'value',
    (props) => (`games/${props.gameId}`),
    (props) => (snapshot) => {
      if (snapshot.val() !== null && typeof snapshot.val() === 'object') {
        props.setGame(snapshot.val())
      }
    }
  ),
)

const ManageGame = ({gameId, game }) => (
  <GameStartReadyScreen game={game} gameId={gameId} />
)

const EnhancedManageGame = enhance(ManageGame)


const ManageGameMatrix = ({user, gameId}) => (
  <EnhancedManageGame user={user} gameId={gameId}/>
)

export default enhance2RiseOfTheMachines(ManageGameMatrix)
