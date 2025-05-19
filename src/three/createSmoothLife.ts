import * as THREE from 'three';
import {createComputed, createSignal} from '@motion-canvas/core/lib/signals';
import {useScene} from '@motion-canvas/core/lib/utils';
import {Color as MCColor} from '@motion-canvas/core/lib/types';
import {smoothLifeMaterial} from './smoothlife';

export function createSmoothLifeMaterial() {
    const time = createSignal(0);
    const color = MCColor.createSignal('#ff0000');
    const intensity = createSignal(1);

    const update = createComputed(() => {
        // Material uniforms are updated in smoothlife.ts
    });

    function setup() {
        time.reset();
        color.reset();
        intensity.reset();
        useScene().lifecycleEvents.onBeginRender.subscribe(update);
    }

    return {
        material: smoothLifeMaterial,
        setup,
        time,
        color,
        intensity
    };
}

export function createSmoothLife() {
    const material = createSmoothLifeMaterial();
    const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(),
        material.material
    );

    return {
        mesh,
        ...material
    };
} 