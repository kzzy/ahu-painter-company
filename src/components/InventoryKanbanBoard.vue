<script setup>
import { onMounted, ref } from 'vue'
import draggable from 'vuedraggable';
import * as firebaseAuth from "firebase/auth";
import { getRole, getUsername } from './helpers/helper';
import axios from 'axios';

const availablePaints = ref([])
const lowOnStockPaints = ref([])
const outOfStockPaints = ref([])
// Permitted colours are Blue, Grey, Black, White, Purple
const paintQuantities = ref({
    "Blue" : -1,
    "Grey" : -1,
    "Black" : -1,
    "White" : -1,
    "Purple" : -1
})
const lastUpdateTimeStamp = ref()
const lastUpdateAuthor = ref()
const userName = ref()
const userPerms = ref('Reader')
const userBoardInteractState = ref('Viewing')
const canEditBoard = ref(false)
const canDrag = ref(true)
const authObservable = firebaseAuth.getAuth();

const paintBackgroundColorMap = {
    "Blue": "bg-blue-400",
    "Grey": "bg-gray-400",
    "Black": "bg-black",
    "White": "bg-slate-200",
    "Purple": "bg-purple-400",
}

const interactStateText = {
    "Viewing" : "🔍 Viewing",
    "Editing" : "✏️ Editing"
}

// Observable to watch onAuthState
firebaseAuth.onAuthStateChanged(authObservable, (userCredential) => {
    if(userCredential) {
        setUserInfo(userCredential.uid)
    } else {
        resetBoardState()
    }
})

// API call to get paint inventory stock
const getPaintInventory = async() => {
    try {
        const { data } = await axios.get(import.meta.env.VITE_API_BASE_URL + "paint")

        Object.entries(data).forEach((entry) => {
            const colour = entry[0].charAt(0).toUpperCase() + entry[0].substring(1)
            const quantity = entry[1].quantity
            const status = entry[1].status

            paintQuantities.value[colour] = parseInt(quantity)

            if(status === 'available') {
                availablePaints.value.push(colour)
            } 

            if(status === 'lowonstock') {
                lowOnStockPaints.value.push(colour)
            }

            if(status === 'outofstock') {
                outOfStockPaints.value.push(colour)
            }
        })
        
    } catch (err) {
        console.log("Error fetching paint inventory", err)
    }
}

const saveToPaintInventory = async(colour, val, status) => {
    // Update paint data in database
    try {
        const endpoint = import.meta.env.VITE_API_BASE_URL + "paint/" + colour.toLowerCase()
        const obj = {
            status: status,
            quantity: val
        }
        await axios.patch(endpoint, obj)
        
    } catch (err) {
        console.log("Error when attempting to post paint data")
        return
    } 
 
    // Update last change history data in database
    try {
        const endpoint = import.meta.env.VITE_API_BASE_URL + "paint/last/update"
        const obj = {
            author: userName.value,
            timestamp: new Date(Date.now()).toLocaleString("en-CA", { timeZone: "America/Vancouver" })
        }
        await axios.patch(endpoint, obj)
    } catch (err) {
        console.log(err)
    }
}

// API call to get last history
const getLastUpdateTimeStamp = async () => {
    try {
        const { data } = await axios.get(import.meta.env.VITE_API_BASE_URL + "paint/last")
        lastUpdateAuthor.value = data.author
        lastUpdateTimeStamp.value = data.timestamp
    } catch (err) {
        console.log("Error fetching last update information", err)
    }
}

// Paint Quantity Event Listener
const onValueChange = (paint, newVal, status) => {
    console.log("Detected value update on paint:", paint, newVal)

    saveToPaintInventory(paint, newVal, status)
}

// Paint category change Event Listener
function onLaneChange(event) {
    if(event.added != null) {
        const paint = event.added.element;

        let status = ''
        if(availablePaints.value.includes(paint)) {
            status = 'available'
        } else if(lowOnStockPaints.value.includes(paint)) {
            status = 'lowonstock'
        } else if(outOfStockPaints.value.includes(paint)) {
            status = 'outofstock'
        }
        console.log("Moved to", status)

        saveToPaintInventory(paint, paintQuantities.value[paint], status)
    }
}

// Switch between view and edit state if you are the correct user profile
const updateInteractStateStatus = () => {
    if(userPerms.value == 'Painter') {
        if(userBoardInteractState.value == 'Editing') {
            userBoardInteractState.value = 'Viewing'
            canEditBoard.value = false
        } else {
            userBoardInteractState.value = 'Editing'
            canEditBoard.value = true
        }
    }
}

const setUserInfo = async(userID) => {
    userName.value = await getUsername(userID)
    userPerms.value = await getRole(userID)
}

const resetBoardState = () => {
    userBoardInteractState.value = 'Viewing'
    userPerms.value = 'Reader'
    canEditBoard.value = false
    canDrag.value = true
}

onMounted(() => {
    getPaintInventory()
    getLastUpdateTimeStamp()
})

</script>

<template>
    <div class="bg-slate-800 rounded-lg">
        <div class="py-4 text-center text-white">
            <h1 class="text-4xl font-semibold mb-2">Paint Inventory</h1>
            <div class="flex gap-x-1 justify-center">
                <div>Last Updated</div>
                <div>{{ lastUpdateTimeStamp }} by</div>
                <div class="font-medium">{{ lastUpdateAuthor }}</div>
            </div>
        </div>
        <div class="flex justify-end">
            <div class="text-lg font-semibold hidden">Save</div>
            <div class="rounded-lg mr-8 p-1 select-none hover:cursor-pointer hover:bg-slate-700" @click="updateInteractStateStatus()">
                <div class="text-lg font-semibold">{{ interactStateText[userBoardInteractState] }}</div>
            </div>
        </div>
        <div class="flex flex-wrap gap-4 p-4 justify-center select-none">
            <div class="w-60 p-5 border bg-slate-200 text-black drop-shadow-lg">
                <h2 class="text-xl font-bold">Available</h2>
                <draggable v-model="availablePaints" group="paints" @change="onLaneChange" itemKey="availablePaints" :disabled="!canEditBoard || !canDrag">
                    <template #item="{element: availablePaints}">
                        <div class="flex my-3 p-4 text-xl bg-white drop-shadow-md" :class="{'hover:cursor-pointer':canEditBoard}"> 
                            <div>
                                {{  availablePaints  }}
                                <div class="w-16 h-1" :class="paintBackgroundColorMap[availablePaints]"></div>
                            </div>
                            <div class="flex text-sm ml-auto">
                                <input v-model="paintQuantities[availablePaints]" v-on:focusin="canDrag = false" v-on:focusout="canDrag = true" v-on:change="onValueChange(availablePaints, paintQuantities[availablePaints], 'available')" type="number" class="w-12 h-5 text-right outline-none" :class="{'border border-gray-500': canEditBoard}" :disabled="!canEditBoard"/>
                                <div class="ml-1">Gal</div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>

            <div class="w-60 p-5 border bg-slate-200 text-black drop-shadow-lg">
                <h2 class="text-xl font-bold">Low on Stock</h2>
                <draggable v-model="lowOnStockPaints" group="paints" @change="onLaneChange" itemKey="lowOnStockPaints" :disabled="!canEditBoard || !canDrag">
                    <template #item="{element: lowOnStockPaints}">
                        <div class="flex my-3 p-4 text-xl bg-white drop-shadow-md" :class="{'hover:cursor-pointer':canEditBoard}">
                            <div> 
                                {{  lowOnStockPaints  }}
                                <div class="w-20 h-1" :class="paintBackgroundColorMap[lowOnStockPaints]"></div>
                            </div>
                            <div class="flex text-sm ml-auto">
                                <input v-model="paintQuantities[lowOnStockPaints]" v-on:focusin="canDrag = false" v-on:focusout="canDrag = true" v-on:change="onValueChange(lowOnStockPaints, paintQuantities[lowOnStockPaints], 'lowonstock')" type="number" class="w-12 h-5 text-right outline-none" :class="{'border border-gray-500': canEditBoard}" :disabled="!canEditBoard"/>
                                <div class="ml-1">Gal</div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>

            <div class="w-60 p-5 border bg-slate-200 text-black drop-shadow-lg">
                <h2 class="text-xl font-bold">Out of Stock</h2>
                <draggable v-model="outOfStockPaints" group="paints" @change="onLaneChange" itemKey="outOfStockPaints" :disabled="!canEditBoard || !canDrag">
                    <template #item="{element: outOfStockPaints}">
                        <div class="flex my-3 p-4 text-xl bg-white drop-shadow-md" :class="{'hover:cursor-pointer':canEditBoard}">
                            <div> 
                                {{ outOfStockPaints  }}
                                <div class="w-20 h-1" :class="paintBackgroundColorMap[outOfStockPaints]"></div>
                            </div>
                            <div class="flex text-sm ml-auto">
                                <input v-model="paintQuantities[outOfStockPaints]" v-on:focusin="canDrag = false" v-on:focusout="canDrag = true" v-on:change="onValueChange(outOfStockPaints, paintQuantities[outOfStockPaints], 'outofstock')" type="number" class="w-12 h-5 text-right outline-none" :class="{'border border-gray-500': canEditBoard}" :disabled="!canEditBoard"/>
                                <div class="ml-1">Gal</div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>