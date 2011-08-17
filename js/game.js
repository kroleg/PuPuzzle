jQuery(function($){
//    var fugures_types = {
//        solo : {width:1, height: 1},
//        hor : {width:2, height: 1},
//        vert : {width:1, height: 2},
//        target : {width:2, height: 2}
//    };
    var sets = {
        set1: [
//            {type:"vert", left: 1, top: 1},
            {name:"g1", type: 'vert',   left: 1, top: 1},
            {name:"g2", type: 'vert',   left: 4, top: 1},
            {name:"g3", type: 'vert',   left: 1, top: 3},
            {name:"g4", type: 'vert',   left: 4, top: 3},
            {name:"r",  type: 'target', left: 2, top: 1},
            {name:"y1", type: 'hor',    left: 2, top: 3},
            {name:"b1", type: 'solo',   left: 1, top: 5},
            {name:"b2", type: 'solo',   left: 2, top: 4},
            {name:"b3", type: 'solo',   left: 3, top: 4},
            {name:"b4", type: 'solo',   left: 4, top: 5}
        ],
        set2: [
            {name:"g1", type: 'vert',  left: 1, top: 1},
            {name:"g2", type: 'vert',  left: 4, top: 1},
            {name:"r",  type: 'target',left: 2, top: 1},
            {name:"y1", type: 'hor',   left: 1, top: 3},
            {name:"y2", type: 'hor',   left: 3, top: 3},
            {name:"y3", type: 'hor',   left: 2, top: 4},
            {name:"b1", type: 'solo',  left: 1, top: 4},
            {name:"b2", type: 'solo',  left: 1, top: 5},
            {name:"b3", type: 'solo',  left: 4, top: 4},
            {name:"b4", type: 'solo',  left: 4, top: 5}
        ],
        set3: [
            {name:"g1", type: 'vert',   left: 1, top: 1},
            {name:"g2", type: 'vert',   left: 4, top: 1},
            {name:"r",  type: 'target', left: 2, top: 1},
            {name:"y1", type: 'hor',    left: 2, top: 4},
            {name:"b1", type: 'solo',   left: 1, top: 3},
            {name:"b2", type: 'solo',   left: 1, top: 4},
            {name:"b3", type: 'solo',   left: 1, top: 5},
            {name:"b4", type: 'solo',   left: 2, top: 3},
            {name:"b5", type: 'solo',   left: 3, top: 3},
            {name:"b6", type: 'solo',   left: 4, top: 3},
            {name:"b7", type: 'solo',   left: 4, top: 4},
            {name:"b8", type: 'solo',   left: 4, top: 5}
        ]
    };

    var board = new Object;
    board = {
        slide_duration : 150,
        size :{x:4,y:5},
        point_size : 100,
        current: 'set1'
    };

//    console.log();

    board.init = function(set_name){
//        console.log(set_name);
        if (typeof(set_name) !== 'undefined'){
            this.current = set_name;
            var saved = getCookie(set_name);
            if (saved)
                this.figures = $.parseJSON(saved);
            else
                this.figures = clone(sets[set_name]);
        }
        else { //reset
//            console.log('aloha');
            this.figures = clone(sets[this.current]);
            setCookie(this.current,'');
        }

        $('#board .inner').html('');
        for (var i in this.figures){
            var slider = this.figures[i];
            var type;
            switch (slider.type){
                case 'solo':
                    slider.height = 1;
                    slider.width = 1;
                    break;
                case 'hor':
                    slider.height = 1;
                    slider.width = 2;
                    break;
                case 'vert':
                    slider.height = 2;
                    slider.width = 1;
                    break;
                case 'target':
                    slider.height = 2;
                    slider.width = 2;
            }

            $('<div/>')
                    .attr('id',slider.name)
                    .attr('class','figure ' + slider.type)
//                    .css('background',color)
                    .appendTo('#board .inner');
        }

        this.draw();
    };

    board.calc_css_top_left = function(){

    };

    board.find_figure = function(name){
        for (i in this.figures){
            if (this.figures[i].name == name){
                return this.figures[i];
            }
        }
    }

    board.move = function(f_name,dest){
        var tmp = [],tmp_y=[];

        var dest_possible = {
            left:{x:-1,y:0},
            right:{x:1,y:0},
            up:{x:0,y:-1},
            down:{x:0,y:1}
        };

        var move_vect = dest_possible[dest];

        for (var i = 0;i<this.size.y;i++)
            tmp_y[i]= 0;
        for (i = 0;i<this.size.x;i++)
            tmp[i] = tmp_y.slice();

        var figures_moved = clone(this.figures);
        var board_size_x = this.size.x;
        var board_size_y = this.size.y;

        var points = 0;
        //move figure
        for (i in figures_moved){
            var f = figures_moved[i];

            if (f.name == f_name){
                f.left +=  move_vect.x;
                f.top += move_vect.y;
                //check if figure was moved on board's border
                if (f.left <= 0 || f.left + f.width - 1 > board_size_x
                        || f.top <= 0 || f.top + f.height - 1 > board_size_y)  {
//                    console.log('hit');
                    //animate-move
                    return false;
                }
            }
            //detecting if our figure was moved on another by counting how many figures are in every board's cell
            for (var j = f.left - 1; j < f.left + f.width - 1; j++){
                for (var k = f.top - 1; k < f.top + f.height - 1; k++){
                    points += 1;
                    tmp[j][k] += 1;
                    if (tmp[j][k] > 1) {
                        return false;
                    }
                }
            }
        }

        //good
        this.figures = figures_moved;

        //animate figure moving
        var f_moved = this.find_figure(f_name);
        $('#'+f_moved.name).animate(
            {
                'left' : this.point_size * (f_moved.left - 1) - 2,
                'top' : this.point_size * (f_moved.top - 1) - 2
            },
            this.slide_duration
        );

        setCookie(this.current, $.toJSON(figures_moved), 30);

        return true;
    };
    board.draw = function(){ /* repaint board */
        for (var i in this.figures){
            var figure = this.figures[i];
            var border_width = 2;
            $('#'+figure.name).css({
                'left':this.point_size * (figure.left - 1) - border_width,
                'top':this.point_size * (figure.top - 1) - border_width,
                'width':this.point_size * (figure.width) - border_width,
                'height':this.point_size * (figure.height) - border_width
            });
        }
    };



    board.init('set1');

    /* detect moves */

    var last_x,last_y,figure = null;

    $('.figure').live('mousedown.puzzle',function(e){
        last_x = e.clientX;
        last_y = e.clientY;
        figure = this;
        return false; // prevent from stupid auto-drag
    });

    $('body').bind('mouseup.puzzle',function(e){
        var min_delta = 50;
        if (figure != null){
            var dx = e.clientX - last_x;
            var dy = e.clientY - last_y;
//            console.log(dx + ' ' + dy);
            if (Math.abs(dx) > min_delta || Math.abs(dy) > min_delta){
                var dest = null;
                if (Math.abs(dx) / Math.abs(dy) > 1.2){ //should move by X axis
                    dest = (dx < 0) ? 'left' : 'right';
                }
                else if (Math.abs(dy) / Math.abs(dx) > 1.2){ //should move by Y axis
                    dest = (dy > 0) ? 'down' : 'up';
                }
                if (dest){
                    board.move($(figure).attr('id'),dest);
//                    board.draw();
                }
            }
        }
        figure = null;
    });

    $('.button').click(function(){
        board.init($(this).attr('id'));
        board.draw();
        $('.button').removeClass('active');
        $(this).addClass('active');
    });

    $('#reset').click(function(){board.init()})
});
