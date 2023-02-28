"use strict";
import { PlayerGetPlayer, PlayerRunEnlargeAnimation } from "../../App/Drawables/Player.js";
import { PowerUpRunAnimation } from "../../App/Drawables/PowerUp.js";
import { UiModRunAnimation } from "../../App/Drawables/Ui/Ui.js";
import { ButtonGetButtons, ButtonRunScaleAnimation, ButtonSetDefaultMeshProps } from "../Drawables/Widgets/Button.js";


const PLAYER_ENLARGE_ANIMATION_DURATION = 2000; // 2 seconds


export class Animation{
    
    animationClbk = null;
    stopAnimationClbk = null;
    inAnimation = false;
    
    Create(animationClbk, stopAnimationClbk){
        this.animationClbk = animationClbk;
        this.stopAnimationClbk = stopAnimationClbk;
        this.inAnimation = true;
        // If timer param, set timer        
    }
    Start(){

    }
    Stop(){

    }
    Run(){
        this.inAnimation = this.animationClbk();
    }
    Stop(){
        this.stopAnimationClbk();
    }
}
export class Animations{
    animations = [];
    count = 0;

    Create(animationClbk, stopAnimationClbk){
        const idx = this.count;
        this.animations[idx] = new Animation;
        this.animations[idx].Create(animationClbk, stopAnimationClbk);
        this.count++;
    }
    Run(){
        if(this.count){
            for(let i=0; i<this.count; i++){
                if(this.animations[i].inAnimation){
                    this.animations[i].Run();
                }
                else{ // Here do stuf if NOT inAnimation
                    this.animations[i].Stop();
                    this.count--;
                }
            }
        }
    }
}

const animations = new Animations;
export function AnimationsGet(){
    return animations;
}




export function RunAnimations() {

    ButtonCreateScaleAnimation();
    UiModRunAnimation();
    PowerUpRunAnimation();
    PlayerEnlargeAnimation();

}




function ButtonCreateScaleAnimation() {
    
    const maxUpScale = 1.3;
    const minDownScale = 1;
    const upScaleFactor = 1.02;
    const downScaleFactor = 0.98;

    const buttons = ButtonGetButtons();

    for (let i = 0; i < buttons.btn.length; i++) {

        // Cash for convinience
        const area    = buttons.btn[i].area.mesh;
        const state   = buttons.btn[i].state;
        
        /**
         * 'state.inAnimation' is for running the complete animation
         * even if the mouse is hovering the button for shorter 
         * ammount of time than the animation time cycle.
         */
        if (state.inHover) {
            state.inAnimation = true;
        }


        if (state.inAnimation && area.scale[0] < maxUpScale && !state.inDownScale) {

            ButtonRunScaleAnimation(i, upScaleFactor);
            state.inUpScale = true;
        }
        else if (!state.inHover && area.scale[0] > minDownScale) {
            
            ButtonRunScaleAnimation(i, downScaleFactor);
            state.inDownScale = true;
            if(area.scale[0] < minDownScale)
                area.scale[0] = minDownScale;
        }
        else if (state.inAnimation){ 
            /**
             * If the upScale AND downScale of the animation was completed, 
             * then set pos,scale,wpos to default values. 
             * That is because of the cpu float rounding errors that occur
             * during text manipulation.(The text does not return to it'sdefault values)
             */
            if(!state.inHover && state.inDownScale && area.scale[0] === minDownScale){
               
               ButtonSetDefaultMeshProps(i);
               console.log(state.inAnimation)
               state.inAnimation = false;
            }
            state.inUpScale   = false;
            state.inDownScale = false;
           
        }
    }
}

export function PlayerEnlargeAnimation(){

    const player = PlayerGetPlayer();

    const maxUpScaleDim = 130;
    const minDownScaleDim = player.mesh.defDim[0];
    const upScaleFactor = 1.014;
    const downScaleFactor = 0.996;


    if(player.state.inAnimation){

        if(player.mesh.dim[0] >= maxUpScaleDim && ! player.timeOutId){
            player.timeOutId = setTimeout(()=>{player.state.inUpScale = false;}, PLAYER_ENLARGE_ANIMATION_DURATION);
        }

        if(player.mesh.dim[0] < maxUpScaleDim && player.state.inUpScale){
            PlayerRunEnlargeAnimation(upScaleFactor);

        }
        else if(!player.state.inUpScale && player.mesh.dim[0] > minDownScaleDim){
            PlayerRunEnlargeAnimation(downScaleFactor);
            if(player.mesh.dim[0] <= minDownScaleDim){
                player.state.inAnimation = false;
            }
        }

    }

}




/////////////////////////////////////////////////////////////////////////////////////////////////////
