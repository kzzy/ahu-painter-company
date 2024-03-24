<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable';
import * as firebaseAuth from "firebase/auth";
import { db } from '@/firebase'
import { ref as fbref, get } from '@firebase/database'

const availablePaints = ref(['Red', 'Black', 'Purple'])
const lowOnStockPaints = ref(['Yellow'])
const outOfStockPaints = ref(['Green', 'Blue', 'Cyan'])
const paints = ref([availablePaints, lowOnStockPaints, outOfStockPaints])
const paintQuantities = ref({
    "Red":25,
    "Black":30,
    "Purple":40,
    "Yellow":10,
    "Green":0,
    "Blue":0,
    "Cyan":0
})
const lastUpdated = ref()
const lastUpdateAuthor = ref()
const userPerms = ref('Reader')
const userBoardInteractState = ref('Viewing')
const canEditBoard = ref(false)

const authObservable = firebaseAuth.getAuth();
// Observable to watch onAuthState
firebaseAuth.onAuthStateChanged(authObservable, (userCredential) => {
    if(userCredential) {
        setPermissions(userCredential.uid)
    } else {
        userPerms.value = 'Reader'
    }
})

const getPaintInventory = () => {

}

const getLastUpdateTimeStamp = () => {

}

/* Get interact text state of the board */
const getInteractStateStatus = () => {
    if(userBoardInteractState.value == 'Editing') {
        return "✏️ Editing"
    }
    return "🔍 Viewing"
}

/* Switch between view and edit state if you are the correct user profile */
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

function log(event) {
    console.log(event)
}

const paintBackgroundColorMap = {
    "Blue": "bg-blue-400",
    "Grey": "bg-grey-400",
    "Black": "bg-black",
    "White": "bg-white",
    "Purple": "bg-purple-400",
    // Test Colors
    "Red": "bg-red-400",
    "Yellow": "bg-yellow-400",
    "Green": "bg-green-400",
    "Cyan": "bg-cyan-400"
  }

const setPermissions = (userID) => {
    get(fbref(db, 'users/' + userID)).then((snapshot) => {
        userPerms.value = snapshot.val().role
        console.log("Succesfully allocated permissions to current user")
    }).catch((err) => {
        console.log("Failed to retrieve user permissions:", err)
    })
}
</script>

<template>
    <div class="bg-slate-800 rounded-lg">
        <div class="py-4 text-center text-white">
            <h1 class="text-4xl font-semibold mb-2">Paint Inventory</h1>
            <p class="text-sm">Last Updated - February 20, 2024 @ 8:50pm by James</p>
        </div>
        <div class="flex justify-end">
            <div class="text-lg font-semibold hidden">Save</div>
            <div class="rounded-lg mr-8 p-1 select-none hover:cursor-pointer hover:bg-slate-700" @click="updateInteractStateStatus()">
                <div class="text-lg font-semibold">{{ getInteractStateStatus() }}</div>
            </div>
        </div>
        <div class="flex flex-wrap gap-4 p-4 justify-center select-none">
            <div class="w-60 p-5 border bg-slate-200 text-black drop-shadow-lg">
                <h2 class="text-xl font-bold">Available</h2>
                <draggable v-model="availablePaints" group="paints" @change="log" itemKey="availablePaints" :disabled="!canEditBoard">
                    <template #item="{element: availablePaints}">
                        <div class="flex my-3 p-4 text-xl bg-white drop-shadow-md" :class="{'hover:cursor-pointer':canEditBoard}"> 
                            <div>
                                {{  availablePaints  }}
                                <div class="w-16 h-1" :class="paintBackgroundColorMap[availablePaints]"></div>
                            </div>
                            <div class="flex text-sm ml-auto">
                                <input v-model="paintQuantities[availablePaints]" type="number" class="w-12 h-5 text-right outline-none" :class="{'border border-gray-500': canEditBoard}" :disabled="!canEditBoard"/>
                                <div class="ml-1">Gal</div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>

            <div class="w-60 p-5 border bg-slate-200 text-black drop-shadow-lg">
                <h2 class="text-xl font-bold">Low on Stock</h2>
                <draggable v-model="lowOnStockPaints" group="paints" @change="log" itemKey="lowOnStockPaints" :disabled="!canEditBoard">
                    <template #item="{element: lowOnStockPaints}">
                        <div class="flex my-3 p-4 text-xl bg-white drop-shadow-md" :class="{'hover:cursor-pointer':canEditBoard}">
                            <div> 
                                {{  lowOnStockPaints  }}
                                <div class="w-20 h-1" :class="paintBackgroundColorMap[lowOnStockPaints]"></div>
                            </div>
                            <div class="flex text-sm ml-auto">
                                <input v-model="paintQuantities[lowOnStockPaints]" type="number" class="w-12 h-5 text-right outline-none" :class="{'border border-gray-500': canEditBoard}" :disabled="!canEditBoard"/>
                                <div class="ml-1">Gal</div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>

            <div class="w-60 p-5 border bg-slate-200 text-black drop-shadow-lg">
                <h2 class="text-xl font-bold">Out of Stock</h2>
                <draggable v-model="outOfStockPaints" group="paints" @change="log" itemKey="outOfStockPaints" :disabled="!canEditBoard">
                    <template #item="{element: outOfStockPaints}">
                        <div class="flex my-3 p-4 text-xl bg-white drop-shadow-md" :class="{'hover:cursor-pointer':canEditBoard}">
                            <div> 
                                {{ outOfStockPaints  }}
                                <div class="w-20 h-1" :class="paintBackgroundColorMap[outOfStockPaints]"></div>
                            </div>
                            <div class="flex text-sm ml-auto">
                                <input v-model="paintQuantities[outOfStockPaints]" type="number" class="w-12 h-5 text-right outline-none" :class="{'border border-gray-500': canEditBoard}" :disabled="!canEditBoard"/>
                                <div class="ml-1">Gal</div>
                            </div>
                        </div>
                    </template>
                </draggable>
            </div>
        </div>
    </div>
</template>