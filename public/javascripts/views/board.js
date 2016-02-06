App.Views.Board = Support.CompositeView.extend({
    tagName: 'table',

    events: {
        'click': 'handleClick'
    },
    
    
    render: function() {
        this.template = _.template($('#board-template').text());
        this.$el.html(this.template());
        return this;
    },

    handleClick: function(evt) {
        var col = evt.target.cellIndex;
        var row = $(evt.target.parentNode).index();
        var moveSpec = {row: row, col: col};
        App.socket.emit('move', moveSpec);
        console.log(moveSpec);
    }
});
