const button = document.getElementById("button");
const board = document.getElementById("board");

var board_info =
{
	cnt_row : 10,
	cnt_col : 10,
	cnt_bomb : 10,
	dead : false
};

let state = new Array(11);
for(var i=1; i<=10; i++)
{
	state[i] = new Array(11).fill(0);
}
var cnt=0;

function rng(l, r)
{
	return Math.floor(Math.random()*(r-l+1))+l;
}

let flag = new Array(101).fill(false);
let clicked = new Array(11);
for(var i=1; i<=10; i++)
{
	clicked[i] = new Array(11).fill(false);
}

function hash(i, j)
{
	return (i-1)*board_info.cnt_col+j-1;
}

function init()
{
	var bomb = new Set();
	while(bomb.size <= board_info.cnt_bomb)
	{
		var idx=rng(1, 100);
		bomb.add(idx);
		flag[idx]=true;
	} //add bombs
	var table=document.createElement('table');
	var row, td;
	for (var i=1; i<=board_info.cnt_row; i++) 
	{
        row = document.createElement('tr');
        for (var j=1; j<=board_info.cnt_col; j++) 
        {
            td = document.createElement('td');
            td.id=hash(i, j);
            row.appendChild(td);
            td.textContent='';
            addCellListener(td, i, j);
        }
        table.appendChild(row);
    }
    document.getElementById('MinesweeperBoard').appendChild(table);
    for(var i=1; i<=board_info.cnt_row; i++)
    {
    	for(var j=1; j<=board_info.cnt_col; j++)
    	{
    		var idx=hash(i, j);
    		if(flag[idx]) state[i][j]=-1;
    		else
    		{
    			for(var x=-1; x<=1; x++)
    			{
    				for(var y=-1; y<=1; y++)
    				{
    					if(x==0 && y==0) continue;
    					var new_i=i+x, new_j=j+y;
    					if(new_i<1 || new_j<1 || new_i>board_info.cnt_row || new_j>board_info.cnt_col) continue;
    					if(flag[hash(new_i, new_j)]) state[i][j]++;
    				}
    			}
    		}
    	}
    }
}

function addCellListener(td, i, j)
{
	td.addEventListener('mousedown', function(){
        cell_click(this, i, j);
    });
}

function reveal(cell, i, j)
{
	clicked[i][j]=true;
	cnt++;
	if(state[i][j]==-1)
	{
		board_info.dead=true;
		cell.textContent='X';
		toggleEndGame();
	}
	if(state[i][j]>0) 
	{
		cell.textContent = state[i][j];
		return;
	}
	cell.textContent='0';
	for(var x=-1; x<=1; x++)
   	{
    	for(var y=-1; y<=1; y++)
    	{
    		if(x==0 && y==0) continue;
    		var new_i=i+x, new_j=j+y;
    		if(new_i<1 || new_j<1 || new_i>board_info.cnt_row || new_j>board_info.cnt_col) continue;
    		if(clicked[new_i][new_j]) continue;
    		let nextcell=document.getElementById(hash(new_i, new_j));
    		if(state[new_i][new_j]>=0) reveal(nextcell, new_i, new_j);
    	}
    }
}

function cell_click(cell, i, j)
{
	if(board_info.dead) return;
	if(clicked[i][j]) return;
	reveal(cell, i, j);
	if(cnt==board_info.cnt_row*board_info.cnt_col-board_info.cnt_bomb) toggleEndGame();
}

// function toggleEndGame()
// {
// 	Let cellset=document.getElementsByClassName("cellset");
// 	for(var i=1; i<=board_info.cnt_row; i++)
// 	{
// 		for(var j=1; j<=board_info.cnt_col; j++)
// 		{
// 			if(clicked[i][j]) continue;
// 			if(state[i][j]>=0) cellset[hash(i, j)].textContent=state[i][j];
// 			else cellset[hash(i, j)].textContent='X';
// 		}
// 	}
// 	if(board_info.dead) document.getElementById("EndGame").textContent="You lose";
// 	else document.getElementById("EndGame").textContent="You win";
// }

window.addEventListener('load', function() {
    init();
});

function newgame()
{
	window.location.reload();
}
