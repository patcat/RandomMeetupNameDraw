var React = require('react'),
	MeetupID = React.createClass({
	getDefaultProps: function() {
		return {
			value: 0,
			whenChanged: function() {console.log('No function set for meetup ID!')}
		}
	},
	render: function() {
		return (
			<div className="form-elem form-elem--meetupID">
				<input className="form-elem__input" type="text" value={this.props.value} onChange={this.props.whenChanged} />
				<div className="form-elem__help-text">(Meetup Event ID goes here)</div>
			</div>
		)
	}
});

module.exports = MeetupID;