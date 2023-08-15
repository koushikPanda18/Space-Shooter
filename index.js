// The Game Checklist
// 1.Create a player
// 2.Shoot Projectiles
// 3.Create Enimies
// 4.Detect Collision on enimies----projectile hit 
// 5.Detect Collision on enimies----player hit
// 6.Remove off screen Projectiles
// 7.Colorize yhe Game
// 8.Shrink enemies on hit
// 9.Create Projectile Explosion on hit
// 10.Add Score
// 11.Add Game over UI
// 12.Add restart button
// 13.Add Start Game button


const backgroundContainer=document.querySelector(".background");
const backgroundButton=document.querySelector(".btn")
const backButton=document.querySelector(".backBtn");
const over=document.querySelector(".over");
const canvas=document.querySelector("canvas");
const scoreContainer=document.querySelector(".score");
const gameOverContainer=document.querySelector(".gameOver");
const UIscore=document.querySelector(".uiscore");
const startGamebtn=document.querySelector(".startGameBtn");
const c=canvas.getContext("2d");
let newImage=new Image();
newImage.src="3072824.jpg";
canvas.width=innerWidth;
canvas.height=innerHeight;

// console.log(gsap)
function randomIntreger(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

//player class
class Player{
    constructor(x,y,radious,color){
        this.x=x;
        this.y=y;
        this.radious=radious;
        this.color=color;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radious,0,360,false);
        c.fillStyle=this.color;
        c.fill();
    }
}


//Projectile Class
class Projectile{
    constructor(x,y,radious,color,velocity){
        this.x=x;
        this.y=y;
        this.radious=radious;
        this.color=color;
        this.velocity=velocity;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radious,0,360,false);
        c.fillStyle=this.color;
        c.fill();
    }
    update(){
        this.draw();
        //assigning velocity to the projectiles
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    }
}



//enemy Class
class Enemy{
    constructor(x,y,radious,color,velocity){
        this.x=x;
        this.y=y;
        this.radious=radious;
        this.color=color;
        this.velocity=velocity;
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radious,0,360,false);
        c.fillStyle=this.color;
        c.fill();
    }
    update(){
        this.draw();
        //assigning velocity to the projectiles
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
    }
}


//creating stars
class Star{
    constructor(x,y,radious){
        this.x=x;
        this.y=y;
        this.radious=radious;
        this.color="white";
    }
    draw(){
        c.beginPath();
        c.arc(this.x,this.y,this.radious,0,360,false);
        c.fillStyle=this.color;
        c.fill();
    }
    update(){
        this.draw();
    }
}


//particles class when projectile hits enemy
const friction=0.99;
class Particle{
    constructor(x,y,radious,color,velocity){
        this.x=x;
        this.y=y;
        this.radious=radious;
        this.color=color;
        this.velocity=velocity;
        this.alpha=1;
    }
    draw(){
        c.save();
        c.globalAlpha=this.alpha;
        c.beginPath();
        c.arc(this.x,this.y,this.radious,0,360,false);
        c.fillStyle=this.color;
        c.fill();
        c.restore();
    }
    update(){
        this.draw();
        //decresing the velocity of the particles gradually
        this.velocity.x*=friction;
        this.velocity.y*=friction;
        //assigning velocity to the projectiles
        this.x=this.x+this.velocity.x;
        this.y=this.y+this.velocity.y;
        this.alpha-=0.01;
    }
}




let player=new Player(canvas.width/2,canvas.height/2,10,"white")


//creating multiple projectiles
let projectiles=[];
let particles=[];

let enemies=[];
let starContainer=[];
for(var i=0;i<100;i++){
    let x=randomIntreger(0,canvas.width)
    let y=randomIntreger(0,canvas.height)
    let radious=Math.random()*1;
    starContainer.push(new Star(x,y,radious))
}
//function to spwan enemies
function spwanEnemies(){
    setInterval(()=>{
        const radious=randomIntreger(5,25);
        let x;
        let y;
        if(Math.random()<0.5){
            x=Math.random() < 0.5  ? (0-radious):(canvas.width+radious);
            y=Math.random()*canvas.height;         
        }
        else{
            x=Math.random()*canvas.width;
            y=Math.random() < 0.5  ? (0-radious):(canvas.height+radious);
        }
        const color=`hsl(${randomIntreger(0,360)},50%,50%)`;
            // atan2 produces the angle based on the x and y distance from a particular coordinate    and takes the y cooedinate first(produces in radian)
            const angle=Math.atan2(canvas.height/2-y,canvas.width/2-x);
            // console.log(angle);
            const velocity={
                x:Math.cos(angle),
                y:Math.sin(angle)
            }

        enemies.push(new Enemy(x,y,radious,color,velocity))
    },1000)
}
starContainer.forEach((star)=>{
    star.update();
})

let score=0;
let animationFrame;
function animate(){
    animationFrame=requestAnimationFrame(animate);
    c.fillStyle='rgba(0,0,0,0.1)'
    c.fillRect(0,0,canvas.width,canvas.height);
    player.draw();
    particles.forEach((particle,index)=>{
        particle.update();
        if(particle.alpha<=0){
            particles.splice(index,1)
        }
    })
    starContainer.forEach((star)=>{
        star.update();
    })





    projectiles.forEach((projectile,index)=>{
        projectile.update();
        //removing the projectile that gone out of the screen from the projectiles array
        if(projectile.x-projectile.radious<0 ||
            projectile.x-projectile.radious>canvas.width ||
            projectile.y+projectile.radious<0 ||
            projectile.y-projectile.radious>canvas.height){
            setTimeout(()=>{
                projectiles.splice(index,1);
            },0)
        }
    })
    enemies.forEach((enemy,index)=>{
        enemy.update();
        //detecting a hit between the player and the enemy
        const dist=Math.hypot(player.x-enemy.x,player.y-enemy.y);
        //game over conditon
        if(dist-player.radious-enemy.radious<1){
            cancelAnimationFrame(animationFrame);
            // gameOverContainer.classList.add("active");
            gameOverContainer.style.display="flex";
            over.classList.add("active")
            UIscore.innerHTML=score;
        }


        //detecting collision between projectile and enemy
        projectiles.forEach((projectile,projectileIndex)=>{


            //Math.hypot returns the distance between two objects
            const dist=Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y);

            //if collision occurs
            if(dist-projectile.radious-enemy.radious<1){



                //creating particles on explosions
                for(var i=0;i<enemy.radious*2;i++){
                    particles.push(new Particle(projectile.x,projectile.y,randomIntreger(0,2),enemy.color,{
                        x:(Math.random()-0.5)*(Math.random()*6),
                        y:(Math.random()-0.5)*(Math.random()*6)
                    }))
                }
    
                if(enemy.radious-10>10){
                    // enemy.radious-=10;
                    score+=5;
                    scoreContainer.innerHTML=score;
                    gsap.to(enemy,{
                        radious:enemy.radious-10
                    })
                    setTimeout(()=>{
                        projectiles.splice(projectileIndex,1);
                    },0)
                }
                else{
                    score+=10;
                    scoreContainer.innerHTML=score;
                    setTimeout(()=>{
                        enemies.splice(index,1);
                        projectiles.splice(projectileIndex,1);
                    },0)
                }
            }
        })
    })
}

//creating projectiles whenever ew click on the screen
addEventListener("click",(event)=>{

    // atan2 produces the angle based on the x and y distance from a particular coordinate    and takes the y cooedinate first(produces in radian)
    const angle=Math.atan2(event.clientY-canvas.height/2,event.clientX-canvas.width/2);
    // console.log(angle);
    const velocity={
        x:Math.cos(angle)*6,
        y:Math.sin(angle)*6
    }

    projectiles.push(new Projectile(canvas.width/2,canvas.height/2,4,"white",velocity));
    console.log(projectiles)
    // projectile.draw();
})

// animate();
// spwanEnemies();


startGamebtn.addEventListener("click",()=>{
    init();
    animate();
    spwanEnemies();
    gameOverContainer.style.display="none";
    over.classList.remove("active")
    // console.log("go")
})


function init(){
    player=new Player(canvas.width/2,canvas.height/2,10,"white")
    projectiles=[];
    particles=[];
    enemies=[];
    score=0;
    scoreContainer.innerHTML=score;
    UIscore.innerHTML=score;
    
}


backgroundButton.addEventListener("click",()=>{
    c.clearRect(0,0,canvas.width,canvas.height);
    c.drawImage(newImage,0,0,canvas.width,canvas.height);
    init();
    backgroundContainer.style.display="none";
    over.classList.remove("active")
})

backButton.addEventListener("click",()=>{
    backgroundContainer.style.display="flex";
})