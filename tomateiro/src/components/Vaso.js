import * as THREE from 'three';
import { COLORS } from '../utils/constants.js';

export class Vaso extends THREE.Group {
  constructor() {
    super();

    // Vaso
    const potGeo = new THREE.CylinderGeometry(0.55, 0.4, 0.7, 20);
    const potMat = new THREE.MeshStandardMaterial({ color: COLORS.VASO, roughness: 0.9 });
    const potMesh = new THREE.Mesh(potGeo, potMat);
    potMesh.position.y = -0.35;
    this.add(potMesh);

    // Terra
    const soilGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 20);
    const soilMat = new THREE.MeshStandardMaterial({ color: COLORS.SOLO, roughness: 1 });
    const soilMesh = new THREE.Mesh(soilGeo, soilMat);
    soilMesh.position.y = 0;
    this.add(soilMesh);
  }
}