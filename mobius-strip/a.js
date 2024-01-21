import * as THREE from 'three';
import {
    BufferGeometry,
    DirectionalLight,
    LineDashedMaterial,
    Mesh,
    MeshBasicMaterial, MeshLambertMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial
} from "three";
import {OrbitControls} from "three/addons";
//scene settings
var renderer, scene, controls, camera, axis, circle1, circle2, wrapper, parent, material, button, range;
var radius=3,
    height=6,
    segments=200,//segments must be even
    animationDuration=2;
var tween={
    angle:0,
    circle1:-Math.PI/2,
    circle2:Math.PI/2
};
var tl=new TimelineLite();

setScene();

function setScene(){
    renderer=new THREE.WebGLRenderer();
    renderer.setSize(innerWidth,innerHeight);
    document.body.appendChild(renderer.domElement);

    scene=new THREE.Scene();

    camera=new THREE.PerspectiveCamera(70,innerWidth/innerHeight,1,100);
    camera.position.set(15,8,12);

    controls=new OrbitControls(camera,renderer.domElement);
    controls.addEventListener('change',function(){
        renderer.render(scene,camera);
    },false);

    material=new THREE.MeshPhongMaterial({
        color:0x224477,
        specular:0x224477,
        emissive:0x224477,
        shininess:15,
        shading:THREE.FlatShading,
        side:THREE.DoubleSide
    });

    setLighting();

    scene.add(new AxisHelper(5))

    //put the circles and the wrapper inside a parent object so the manipulation is easier
    parent=new THREE.Object3D();

    addCircles();
    addWrapper();

    parent.position.set(-radius,height/2,0);
    parent.rotation.y=Math.PI;
    scene.add(parent);

    setAnimation();

    renderer.render(scene,camera);
}

function setLighting(){
    var light1=new THREE.DirectionalLight(0xffffff);
    light1.position.set(-5,10,10);
    var light2=new THREE.PointLight(0xffffff,.7,0);
    light2.position.set(5,5,-5);

    scene.add(light1,light2);
}

function addCircles(){
    var circle=new THREE.CircleGeometry(radius,segments);
    circle1=new THREE.Mesh(circle,material);
    circle2=new THREE.Mesh(circle,material);
    circle1.rotation.x=circle2.rotation.x=Math.PI/2;
    circle1.rotation.y=-Math.PI/2;
    circle2.rotation.y=Math.PI/2;
    circle1.position.y=height/2;circle2.position.y=-height/2;
    moveCenter(circle1,circle2);
    function moveCenter(){
        for(var i=0;i<arguments.length;i++){
            for(var j=0;j<arguments[i].geometry.vertices.length;j++){
                arguments[i].geometry.vertices[j].x-=radius/2;
            }
            arguments[i].geometry.verticesNeedUpdate=true;
        }
    }

    parent.add(circle1,circle2);
}

function addWrapper(){
    var geo=new THREE.Geometry();
    segLength=Math.PI*2*radius/segments;
    geo.vertices.push(new THREE.Vector3(0,height/2,0));
    geo.vertices.push(new THREE.Vector3(0,-height/2,0));
    for(var i=0;i<Math.floor(segments/2);i++){
        geo.vertices.push(new THREE.Vector3(0,height/2,segLength*i));
        geo.vertices.push(new THREE.Vector3(0,-height/2,segLength*i));
        geo.vertices.push(new THREE.Vector3(0,height/2,-segLength*i));
        geo.vertices.push(new THREE.Vector3(0,-height/2,-segLength*i));
    }
    geo.faces.push(new THREE.Face3(0,1,2));
    geo.faces.push(new THREE.Face3(1,2,3));
    geo.faces.push(new THREE.Face3(0,1,4));
    geo.faces.push(new THREE.Face3(1,4,5));
    for(var i=1;i<Math.floor(segments/2);i++){
        geo.faces.push(new THREE.Face3(2+(i-1)*4,3+(i-1)*4,6+(i-1)*4));
        geo.faces.push(new THREE.Face3(3+(i-1)*4,6+(i-1)*4,7+(i-1)*4));
        geo.faces.push(new THREE.Face3(4+(i-1)*4,5+(i-1)*4,8+(i-1)*4));
        geo.faces.push(new THREE.Face3(5+(i-1)*4,8+(i-1)*4,9+(i-1)*4));
    }
    wrapper=new THREE.Mesh(geo,material);

    parent.add(wrapper);
}

function setAnimation(){
    button=document.createElement('button');
    button.innerHTML='wrap';
    document.body.appendChild(button);

    range=document.createElement('input');
    range.type='range';
    range.min=0;range.max=1;range.step=0.01;range.value=0;
    document.body.appendChild(range);

    tl.to(tween,animationDuration,{
        angle:Math.PI/segments,
        circle1:0,
        circle2:0,
        ease:Power0.easeNone,
        onUpdate:update,
        onComplete:function(){tl.pause()}
    });

    tl.progress(1);

    range.addEventListener('input',function(){
        tl.pause();tl.progress(range.value);
        button.innerHTML=tl.progress()>.5?'unwrap':'wrap';
    },false);

    button.addEventListener('click',function(){
        tl.progress()>.5?tl.reverse():tl.play();
    },false);
}

function update(){
    //A. Tween the 2 circles
    circle1.rotation.y=tween.circle1;
    circle2.rotation.y=tween.circle2;

    //B. Tween the wrapper
    //1. tween the first segment of each side
    var w=wrapper.geometry.vertices;
    w[2].x=w[3].x=w[4].x=w[5].x=-Math.sin(tween.angle)*segLength;
    w[2].z=w[3].z=Math.cos(tween.angle)*segLength;
    w[4].z=w[5].z=-Math.cos(tween.angle)*segLength;

    //2. rest of the vertex can now refer to the fourth previous vertex, their reference in the algorithm
    var updateWrapper=function(vIndex){
        //which segment from the origin the vertex belongs to
        var segIndex=Math.floor((vIndex+2)/4);
        var negate=1;

        //negate the value if this segment is behind the plane z=0
        if(vIndex/4===Math.floor(vIndex/4)||(vIndex-1)/4===Math.floor((vIndex-1)/4))negate=-1;
        segIndex*=negate;

        w[vIndex].x=w[vIndex-4].x-Math.sin(tween.angle*(2*segIndex-negate))*segLength*negate;
        w[vIndex].z=w[vIndex-4].z+Math.cos(tween.angle*(2*segIndex-negate))*segLength*negate;
    };
    for(var i=6;i<w.length;i++)updateWrapper(i);

    wrapper.geometry.verticesNeedUpdate=true;
    renderer.render(scene,camera);

    //UI
    range.value=tl.progress();
    button.innerHTML=tl.progress()>.5?'unwrap':'wrap';
}