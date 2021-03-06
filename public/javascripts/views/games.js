App.Views.games = Backbone.View.extend({
    tagName: 'div',
    id: 'games-view',

    initialize: function() {
        // $('#main-container').append(this.el);
        // this.render();
    },

    render: function() {
        var button = $('<a>').attr('href', 'games/1/modes')
            .attr('class', 'pure-button')
            .text('Tic-Tac-Toe');
        this.$el.append(button);
        return this;
    },
    
    leave: function() {
        this.off();
        this.remove();
    }    
});
