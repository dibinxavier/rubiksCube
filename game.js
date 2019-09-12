const degree = (rad)=> rad * Math.PI/180;

class Cube {
    constructor(order){
        if(order>10)
            throw new Error("Maximum cube size exceeded!")

        this.axisX = new THREE.Vector3(1,0,0);
        this.axisY = new THREE.Vector3(0,1,0);
        this.axisZ = new THREE.Vector3(0,0,1);
        


        this.order=order;
        this.pieceSize=10;
        this.blocks=[];
        this.offset= (order-1) * this.pieceSize / 2;
        for(let i=0;i<order;i++){
            let sclice=[];
            for(let j=0;j<order;j++){
                let row=[];
                for(let k=0;k<order;k++){
                    let piece ={x:i*this.pieceSize - this.offset,y:j*this.pieceSize - this.offset,z:k*this.pieceSize - this.offset};
                    row.push({...piece});
                }
                sclice.push({...row})
            }
            this.blocks.push({...sclice})
        }
        this.createPieces();
        camera.position.z = order * 25;
    }
    colors =[0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff8c00, 0xffffff]

    createPieces = ()=>{
        for(let i=0;i<this.order;i++){
            for(let j=0;j<this.order;j++){
                for(let k=0;k<this.order;k++){
                    const gap = 1.05;
                    const skinProjection = 0.17;
                    const geometryBox = new THREE.BoxGeometry(this.pieceSize,this.pieceSize,this.pieceSize );
                    const geometryFace = new THREE.PlaneGeometry(this.pieceSize * 0.85,this.pieceSize * 0.85,this.pieceSize );
                    const materialR = new THREE.MeshStandardMaterial( {color: this.colors[0], side: THREE.DoubleSide} );
                    const materialG = new THREE.MeshStandardMaterial( {color: this.colors[1], side: THREE.DoubleSide} );
                    const materialB = new THREE.MeshStandardMaterial( {color: this.colors[2], side: THREE.DoubleSide} );
                    const materialY = new THREE.MeshStandardMaterial( {color: this.colors[3], side: THREE.DoubleSide} );
                    const materialO = new THREE.MeshStandardMaterial( {color: this.colors[4], side: THREE.DoubleSide} );
                    const materialW = new THREE.MeshStandardMaterial( {color: this.colors[5], side: THREE.DoubleSide} );
                    const materialBox = new THREE.MeshStandardMaterial( {color: 0x111111, side: THREE.DoubleSide} );
                   
                    // var modifier = new THREE.SubdivisionModifier( 3 );
                    // modifier.modify( geometryFace );

                    const faceL = new THREE.Mesh( geometryFace, materialO );
                    const faceR = new THREE.Mesh( geometryFace, materialR );
                    const faceF = new THREE.Mesh( geometryFace, materialG );
                    const faceB = new THREE.Mesh( geometryFace, materialB );
                    const faceD = new THREE.Mesh( geometryFace, materialY );
                    const faceU = new THREE.Mesh( geometryFace, materialW );
                    const box = new THREE.Mesh( geometryBox, materialBox );

                    

                    faceU.rotation.set(degree(90),0,0);
                    faceD.rotation.set(degree(90),0,0);

                    faceF.rotation.set(0,0,degree(90));
                    faceB.rotation.set(0,0,degree(90));

                    faceL.rotation.set(0,degree(90),0);
                    faceR.rotation.set(0,degree(90),0);

                    const {x,y,z} = this.blocks[i][j][k];
                    faceU.position.set(x*gap,y*gap + (this.pieceSize/2 + skinProjection) ,z*gap);
                    faceD.position.set(x*gap,y*gap - (this.pieceSize/2 + skinProjection) ,z*gap);

                    faceB.position.set(x*gap,y*gap ,z*gap - (this.pieceSize/2 + skinProjection));
                    faceF.position.set(x*gap,y*gap ,z*gap + (this.pieceSize/2 + skinProjection));

                    faceL.position.set(x*gap - (this.pieceSize/2 + skinProjection),y*gap ,z*gap);
                    faceR.position.set(x*gap + (this.pieceSize/2 + skinProjection),y*gap ,z*gap);

                    box.position.set(x*gap,y*gap ,z*gap);

                    // face.castShadow = true; //default is false
                    // face.receiveShadow = true; //default
                    const pieceGroup = new THREE.Object3D();

                    if(i==0 || j==0 || k==0 || i==(this.order - 1) || j==(this.order - 1) || k==(this.order - 1)){
                        
                        if(i==(this.order - 1))
                            pieceGroup.add( faceR );
                
                        if(i==0)
                            pieceGroup.add( faceL );
                        
                        if(j==(this.order - 1))
                            pieceGroup.add( faceU );
                        
                        if(j==0)
                            pieceGroup.add( faceD );

                        if(k==(this.order - 1))
                            pieceGroup.add( faceF );
                        
                        if(k==0)
                            pieceGroup.add( faceB );
                       
                        pieceGroup.add( box );
                        scene.add(pieceGroup);
                    }
                    this.blocks[i][j][k].piece = pieceGroup;

                }
            }
        }
       
    }

    rotateOnAxisX = (direction)=>{

    }

    rotateSclice = (axis, index) => {
        if(index>=this.order) 
            throw new Error('Rotation not possible on this index : '+index+' because maximum size is : '+(this.order-1));
        if('xyz'.indexOf(axis)==-1)
        throw new Error('Rotation on invalid axis: '+axis);

        switch(axis){
            case 'x':
                for(let i=0;i<this.order;i++){
                    for(let j=0;j<this.order;j++){
                    //    scene.remove(this.blocks[index][i][j].piece);
                        this.blocks[index][i][j].piece.rotateOnAxis(this.axisX,degree(90));
                    }
                }
            break;
            case 'y':
                for(let i=0;i<this.order;i++){
                    for(let j=0;j<this.order;j++){
                    //    scene.remove(this.blocks[i][index][j].piece);
                        this.blocks[i][index][j].piece.rotateOnAxis(this.axisY,degree(90));
                    }
                }
            break;
            case 'z':
                for(let i=0;i<this.order;i++){
                    for(let j=0;j<this.order;j++){
                        // scene.remove(this.blocks[i][j][index].piece);
                        this.blocks[i][j][index].piece.rotateOnAxis(this.axisZ,degree(90));
                    }
                }
            break;
        }
    }
}

let cube = new Cube(3);
cube.rotateSclice('z',2);