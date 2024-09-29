export class Rutas{

    rutasMap: Map<string, Tiporuta> = new Map();
    constructor() {
        this.rutasMap.set('menu', new Tiporuta('menu', 'getmenu', 'addmenu', 'updatemenu', 'deletemenu'));
    }


    
    
}




export class Tiporuta{
    bsPrincipal : string;
    bsget : string;
    bspost :  string;
    bsput : string;
    bsdelete : string;
    constructor(bsPrincipal : string,bsget : string,bspost :  string, bsput : string,bsdelete : string){
        this.bsPrincipal = bsPrincipal;
        this.bsget= bsget;
        this.bspost = bspost;
        this.bsput =bsput;
        this.bsdelete = bsdelete;
    }

}