import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";
//{ numJokesToGet = 10 }
class JokeList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      jokes: [],
    }
  }

  async getJokes() {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      let count = 0;
      while (j.length < this.props.numJokesToGet) {
        count++;
        console.log('getting joke...' + count);
        console.log(j.length);
        console.log(this.props.numJokesToGet);
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" }
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({jokes: j});
    } catch (e) {
      console.log(e);
    }
  }

  async componentDidMount(){
    console.log('component mounted...');
    if (this.state.jokes.length === 0) await this.getJokes();
  };

  generateNewJokes = () => {
    this.setState({jokes: []});
  }

  async componentDidUpdate(prevProps){
    if(this.state.jokes.length === 0){
      await this.getJokes();
    }
  }

  vote = (id, delta) => {
    const updatedVotes = this.state.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    this.setState({jokes: updatedVotes});
  }

  render(){
    if (this.state.jokes.length) {
      let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    
      return (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={this.generateNewJokes}>
            Get New Jokes
          </button>
    
          {sortedJokes.map(j => (
            <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
          ))}
        </div>
      );
    }

    return null;
  }
}

JokeList.defaultProps = {
  numJokesToGet: 10
}
export default JokeList;
