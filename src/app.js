import React from 'react';
import { Router, Route, Link, IndexRoute, browserHistory, IndexLink } from 'react-router';
import Button from 'react-button';
import Games from './gameList.js';

/**
  *@author Chris Bodels
  *
  *
  */


var express = require('express');
var app = express();
var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 4000;
 

var router = express.Router();


router.get('/', function(req, res){
  res.json({message: 'Welcome to my API' });
});


app.use('/api', router);

app.listen(port);
console.log('Starting app on port ' + port);























var games = Games;
var ownedGames = [];
var comments = [];


function containsObject(obj, array)
{
  var i;
  for (i=0; i < array.length; ++i)
  {
    if(array[i] === obj)
    {
      return true;
    }
  }
  return false;
}


function sorterRelease(array)
{
  array.sort(function sortGamesRelease(a, b)
  {
    return parseFloat(a.year) - parseFloat(b.year);
  });
  this.forceUpdate();
}

function sorterAlphabetical(array)
{
  array.sort(function sortGamesAlphabetically(a, b)
  {
    return a.name.localeCompare(b.name);
  });
  this.forceUpdate();
}


class Home extends React.Component
{
  render()
  {
    return(
      <div>
        <h1>Welcome to my online video game store!</h1>
        <p>I made this web app to simulate a simple storefront for selling video games online. Enjoy!</p>
      </div>
    );
  }
};


class Store extends React.Component
{
   buttonClicked(game)
  {
    if(containsObject(game, ownedGames) === true)
    {
      alert("You already own this game, you cannot purchase it again.");
    }
    else
    {
      var result = confirm("Are you sure you want to buy this game?");
      if(result === true)
      {
        ownedGames.push(game);
        alert("Game purchased! You should now see it in your library.");
      }
      else
      {
    
      }
    }
  }
  render()
  {
    const gamesList = games.map(game =>{
      var gameLink = "/store/" + game.name;
      return(
          <li key={game.id}>
            <img src={require(game.img)}/>
            <h3><Link to={gameLink}>{game.name}</Link></h3>
            <p>{game.desc}</p>
            <p>Released: {game.year}</p>
            <p><a href={game.link} target="_blank">Official Website</a></p>
            <Button onClick={this.buttonClicked.bind(this, game)}>Purchase</Button>
          </li>
      )
    })
    return(
      <div>
        <Button onClick={sorterAlphabetical.bind(this, games)}>Sort Alphabetically</Button>
        <Button onClick={sorterRelease.bind(this, games)}>Sort by Release Date</Button>
        <h1>Here are all the games that are currently available</h1>
        <ul id="items">
          {gamesList}
        </ul>
      </div>
    )
  }
};



class Library extends React.Component
{
  render()
  {
    const gamesList = ownedGames.map(game =>{
      var gameLink = "/store/" + game.name;
      return(
        <li key={game.id}>
          <img src={require(game.img)}/>
          <h3><Link to={gameLink}>{game.name}</Link></h3>
          <p>{game.desc}</p>
          <p>Released: {game.year}</p>
          <p><a href={game.link} target="_blank">Official Website</a></p>
        </li>
      )
    })
    return(
      <div>
        <Button onClick={sorterAlphabetical.bind(this, ownedGames)}>Sort Alphabetically</Button>
        <Button onClick={sorterRelease.bind(this, ownedGames)}>Sort by Release Date</Button>
        <h1>Here are all the games you currently own!</h1>
        <ul id="items">
          {gamesList}
        </ul>
      </div>
    );  
  }
};


class gamePage extends React.Component
{
  render()
  {
    var gameName = this.props.params.game;
    var i = games.findIndex(game =>{
      if(game.name === gameName)
      {
        return game;
      }    
    
    });
    return( 
      <div id="gamePage">
        <img src={require(games[i].img)} />
        <h1>{games[i].name}</h1>
        <p>{games[i].desc}</p>
        <ul>
          <p>Released: {games[i].year}</p>
          <p><a href={games[i].link} target="_blank">Official Website</a></p>
        </ul>
        <CommentBox comments={comments} gameName={gameName}/>
      </div>    
    )
  }
}


class CommentsPage extends React.Component
{
  render()
  {
    return(
      <div>
        <CommentBox comments={comments} gameName="N/A"/>
      </div>
    )
  }
}


var Comment = React.createClass({
  render: function(){
    return(
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author} - {this.props.gameName}
        </h2>
        {this.props.children}
      </div>
    )
  }
})


var CommentForm = React.createClass({
  getInitialState: function(){
    return {author: '', text: ''}
  },
  handleAuthorChange: function(e){
    this.setState({author: e.target.value})
  },
  handleTextChange: function(e){
    this.setState({text: e.target.value})
  },
  handleSubmit: function(e){
    e.preventDefault();
    var author = this.state.author.trim()
    var text = this.state.text.trim()
    if(!text || !author){
      return
    }
    this.props.onCommentSubmit({author: author, text: text})
    this.setState({author: '', text: ''})
  },


  render: function(){
    var gameName = this.props.gameName
    if(gameName != "N/A")
    {
    return(
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="Your name"
          value={this.state.author}
          onChange={this.handleAuthorChange}
        />
        <input
          type="text"
          placeholder="Tell people what you think of the game..."
          value={this.state.text}
          onChange={this.handleTextChange}
        />
        <input type="submit" value="Post" />
      </form>
    )
    }
    else
    {
      return(<p> </p>)
    }
  }
})




var CommentList = React.createClass({
  handleUpvote: function(id, gameName){
    var index1 = comments.findIndex(comment =>{
      if(comment.id === id)
        return comment
    })
    comments[index1].score++
    var index = games.findIndex(game =>{
      if(game.name === gameName)
        return game
    })
    var index2 = games[index].commentsArray.findIndex(comment =>{
      if(comment.id === id)
        return comment
    })
    games[index].commentsArray[index2].score++
    console.log(games[index].commentsArray[index2].comment)
    this.forceUpdate()
  },

  handleDownvote: function(id, gameName){
    var index1 = comments.findIndex(comment =>{
      if(comment.id === id)
        return comment
    })
    comments[index1].score--
    var index = games.findIndex(game =>{
      if(game.name === gameName)
        return game
    })
    var index2 = games[index].commentsArray.findIndex(comment =>{
      if(comment.id === id)
        return comment
    })
    games[index].commentsArray[index2].score--
    console.log(games[index].commentsArray[index2].comment)
    this.forceUpdate()
  },

  render: function(){
    var gameName = this.props.gameName
    var index = games.findIndex(game =>{
      if(game.name === gameName)
      {
        return game
      }
    })
    if(gameName != "N/A")
    {
      var commentNodes = games[index].commentsArray.map(comment =>{
        return(
          <Comment author={comment.author} key={comment.id} gameName={comment.game}>
            <ul>
              {comment.comment}
            </ul>
            Comment Score: {comment.score}
              <Button type="submit" onClick={this.handleUpvote.bind(this, comment.id, comment.game)}>Upvote!</Button>
              <Button type="submit" onClick={this.handleDownvote.bind(this, comment.id, comment.game)}>Downvote!</Button>
          </Comment>
        )
      })
    }
    else
    {
      var commentNodes = comments.map(comment =>{
        return(
        <Comment author={comment.author} key={comment.id} gameName={comment.game}>
          <ul>
            {comment.comment}
          </ul>
          Comment Score: {comment.score}
          <Button type="submit" onClick={this.handleUpvote.bind(this, comment.id, comment.game)}>Upvote!</Button>
          <Button type="submit" onClick={this.handleDownvote.bind(this, comment.id, comment.game)}>Downvote!</Button>
        </Comment>
      )
      })
    }
    return(
      <div className ="commentList">
        {commentNodes}
      </div>
    )
  }
})



var CommentBox = React.createClass({
  handleCommentSubmit: function(comment){
    var gameName = this.props.gameName
    var id = comments.length
    comments.push({id: id, game: gameName, author: comment.author, comment: comment.text, score: 1})
    var index = games.findIndex(game =>{
      if(game.name === gameName)
      {
        return game
      }
    })
    games[index].commentsArray.push({id: id, game: gameName, author: comment.author, comment: comment.text, score: 1})
    this.forceUpdate()
  },
  
  render: function(){
    return(
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList comments={this.props.comments} gameName={this.props.gameName}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit} gameName={this.props.gameName} />
      </div>
    )
  }
})




class NotFound extends React.Component
{
  render()
  {
    return(
      <div>
        <h1>404... Page not found</h1>
      </div>
    );
  }
};


var Nav = React.createClass(
{
  render: function()
  {
    return(
      <div id="Nav">
        <ul id="nav">
          <li><IndexLink activeClassName="active" to='/'>Home</IndexLink>&nbsp;</li>
          <li><IndexLink activeClassName="active" to='/store'>Store</IndexLink>&nbsp;</li>
          <li><IndexLink activeClassName="active" to='/library'>Your Library</IndexLink>&nbsp;</li>
          <li><IndexLink activeClassName="active" to='/comments'>Comments</IndexLink>&nbsp;</li>
        </ul>
      </div>
    );
  }
});



var Container = (props) => <div>
  <Nav />
  {props.children}
</div>


  class App extends React.Component
  {
    render()
    {
      return (
        <Router history={browserHistory}>
          <Route path='/' component={Container}>
            <IndexRoute component={Home} />
            <Route path='/Store' component={Store}/>
            <Route path='/Library' component={Library} />
            <Route path='/Store/:game' component={gamePage} />
            <Route path='/Comments' component={CommentsPage} />
            <Route path='*' component={NotFound} />
          </Route>
        </Router>
      );
    }
  };  


export default App;
