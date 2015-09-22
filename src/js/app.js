var React = require('react'),
    MeetupID = require('./meetupID'),
    $ = require('jquery');

var NameDraw = React.createClass({
  getInitialState: function() {
    return {
      name: "",
      meetupID: 0
    }
  },
  componentDidMount: function() {
    var self = this,
        id = getUrlVars()["id"];

    if (id) {
      self.setState({meetupID: id});
    }
  },
  getRandomName: function() {
    var self = this;

    $.get("/chooseMember/" + this.state.meetupID, function(result) {
      if (this.isMounted()) {
        this.setState({
          name: result.name
        });
      }
    }.bind(this));
  },
  handleMeetupIDChange: function(e) {
    this.setState({
      meetupID: e.target.value
    });

    console.log('Meetup ID changed to ', e.target.value, this.state.meetupID);
  },
  render: function() {
    return (
      <div>
        <h1 className="page-title">Random Meetup Name Draw</h1>
        
        <MeetupID value={this.state.meetupID} whenChanged={this.handleMeetupIDChange} />

        <div className="btn btn--submit" onClick={this.getRandomName}>Draw!</div>

        <div className="name">
          {this.state.name}
        </div>

        <div className="group group--poweredby">
          <div className="group__title">Powered by</div>
          <a href="http://www.meetup.com" target="_blank" className="logo logo--meetup">Meetup</a>
        </div>
        <div className="group group--broughttoyou">
          <div className="group__title">Brought to you by</div>
          <a href="http://www.meetup.com/Internet-of-Things-Sydney/" target="_blank" className="logo logo--iotsyd">IoT Sydney</a>
          <a href="http://www.devdiner.com" target="_blank" className="logo logo--devdiner">Dev Diner</a>
        </div>
      </div>
    )
  }
});

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

React.render(<NameDraw />, document.getElementById('app'));
