<template>
<div style="margin-top: -20%; margin-left: -4%">
<div style="position:relative; height: 100%; width: 100%; background: transparent" class="column justify-center" >
<svg
    viewBox='0 0 264 280'
    style="stroke: none"
    version='1.1'
    xmlns='http://www.w3.org/2000/svg'
    xmlns:xlink='http://www.w3.org/1999/xlink'>
    <desc>Created with getavataaars.com</desc>
    <defs>
      <circle id='path-1' cx='120' cy='120' r='120'></circle>
      <path
        d='M12,160 C12,226.27417 65.72583,280 132,280 C198.27417,280 252,226.27417 252,160 L264,160 L264,-1.42108547e-14 L-3.19744231e-14,-1.42108547e-14 L-3.19744231e-14,160 L12,160 Z'
        id='path-2'></path>
      <path
        d='M124,144.610951 L124,163 L128,163 L128,163 C167.764502,163 200,195.235498 200,235 L200,244 L0,244 L0,235 C-4.86974701e-15,195.235498 32.235498,163 72,163 L72,163 L76,163 L76,144.610951 C58.7626345,136.422372 46.3722246,119.687011 44.3051388,99.8812385 C38.4803105,99.0577866 34,94.0521096 34,88 L34,74 C34,68.0540074 38.3245733,63.1180731 44,62.1659169 L44,56 L44,56 C44,25.072054 69.072054,5.68137151e-15 100,0 L100,0 L100,0 C130.927946,-5.68137151e-15 156,25.072054 156,56 L156,62.1659169 C161.675427,63.1180731 166,68.0540074 166,74 L166,88 C166,94.0521096 161.51969,99.0577866 155.694861,99.8812385 C153.627775,119.687011 141.237365,136.422372 124,144.610951 Z'
        id='path-silhouette'></path>
    </defs>
    <g
      id='Avataaar'
      stroke='none'
      stroke-width='1'
      fill='none'
      fill-rule='evenodd'>
      <g
        transform='translate(-825.000000, -1100.000000)'
        id='Avataaar/Circle'>
        <g transform='translate(825.000000, 1100.000000)'>
        <template v-if="isCircle">
            <g
              id='Circle'
              stroke-width='1'
              fill-rule='evenodd'
              transform='translate(12.000000, 40.000000)'>
              <mask id='mask-1' fill='white'>
                <use xlink:href='#path-1'></use>
              </mask>
              <use
                id='Circle-Background'
                fill='#E6E6E6'
                xlink:href='#path-1'></use>
              <g
                id='Color/Palette/Blue-01'
                mask='url(#mask-1)'
                :fill=circleColor>
                <rect id='🖍Color' x='0' y='0' width='240' height='240'></rect>
              </g>
            </g>
            <mask id='mask-2' fill='white'>
              <use xlink:href='#path-2' />
            </mask>
        </template>
          <g id='Mask' />
          <g
            id='Avataaar'
            stroke-width='1'
            fill-rule='evenodd'
            fill='black'
            mask='url(#mask-2)'>
            <g id='Body' transform='translate(32.000000, 36.000000)'>
              <mask id='mask-silhouette' fill='white'>
                <use xlink:href='#path-silhouette'></use>
              </mask>
              <use :fill="skinColors[props.skinColor]" xlink:href='#path-silhouette'></use>
              <path
                d='M156,79 L156,102 C156,132.927946 130.927946,158 100,158 C69.072054,158 44,132.927946 44,102 L44,79 L44,94 C44,124.927946 69.072054,150 100,150 C130.927946,150 156,124.927946 156,94 L156,79 Z'
                id='Neck-Shadow'
                fill-opacity="0.100000001"
                fill='#000000'
                mask='url(#mask-silhouette)'></path>
            </g>
            <svg :style="cssVars" v-html="clothesType[props.clotheType]"></svg>
            <svg v-if="props.clotheType === 'GraphicShirt'" :style="cssVars" v-html="GraphicShirtTypes[props.graphicType]"></svg>
            <svg v-html="eyeTypes[props.eyeType]"></svg>
            <svg v-html="mouthTypes[props.mouthType]"></svg>
            <svg v-html="eyebrowTypes[props.eyebrowType]"></svg>
            <svg>
                <g fill='black' transform='translate(76.000000, 82.000000)'>
                    <g
                      id='Nose/Default'
                      transform='translate(28.000000, 40.000000)'
                      opacity='0.16'>
                      <path
                        d='M16,8 C16,12.418278 21.372583,16 28,16 L28,16 C34.627417,16 40,12.418278 40,8'
                        id='Nose'>

                      </path>
                    </g>
                </g>
            </svg>
            <svg :style="cssVars" v-html="topTypes[props.topType]"></svg>
            <svg :style="cssVars" v-html="facialHairTypes[props.facialHairType]"></svg>
            <svg v-html="accessoriesTypes[props.accessoriesType]"></svg>
          </g>
        </g>
      </g>
    </g>
    
</svg>
    <slot/>
</div>
</div>

</template>
<script>
function 
getRandomChoice (items) {
            const itemsLength = Object.entries(items).length
            return Object.entries(items)[Math.floor((Math.random()*(itemsLength)))][1]
    }
</script>

<script setup>
import { mouthTypes } from '@/assets/avataaars/mouth'
import { eyeTypes } from '@/assets/avataaars/eyes'
import { eyebrowTypes } from '@/assets/avataaars/eyebrows'
import { clothesType } from '@/assets/avataaars/clothes'
import { topTypes } from '@/assets/avataaars/top'
import { accessoriesTypes } from '@/assets/avataaars/accessories'
import { facialHairTypes } from '@/assets/avataaars/facial-hair'
import { GraphicShirtTypes } from '@/assets/avataaars/graphic-shirt'
import { hairColors, skinColors, hatAndShirtColors } from '@/assets/avataaars/colors'



const props = defineProps({
        isCircle: {
            type: Boolean,
            default: true
         },
         circleColor: {
            type: String,
             default: '#6fb8e0'
        },
        accessoriesType: { type: String, default: "Blank"},
        clotheColor: { type: String, default: "#ffffff"},
        clotheType: { type: String, default:'ShirtCrewNeck' },
        eyebrowType: { type: String, default: "Default" },
        eyeType: { type: String, default: "Default" },
        facialHairColor: { type: String, default:  "Auburn" },
        facialHairType: { type: String, default: "Blank" },
        graphicType: { type: String, default: "Skull" },
        hairColor: { type: String, default: "Auburn" },
        mouthType: { type: String, default: 'Default' },
        skinColor: { type: String, default: "#ffffff" },
        topColor: { type: String, default: "Black" },
        topType: { type: String, default: "Blank"},
})

       const  cssVars = computed(() => {
          return {
            '--avataaar-hair-color': !props.hairColor ? 'red' : hairColors[props.hairColor],
            '--avataaar-facial-hair-color': !props.facialHairColor ? 'black' : hairColors[props.facialHairColor],
            '--avataaar-hat-color': !props.topColor ? 'yellow' : hatAndShirtColors[props.topColor],
            '--avataaar-shirt-color': !props.clotheColor ? 'green' : hatAndShirtColors[props.clotheColor],

          }
        }) 




</script>

