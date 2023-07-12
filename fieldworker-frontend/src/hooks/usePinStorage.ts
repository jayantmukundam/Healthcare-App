// Implementing custom hook
import { useEffect, useState } from "react";
import { Storage } from "@ionic/storage";
import FieldWorker from "../components/FieldWorker/FieldWorker";

const PIN_KEY = 'fieldWorker-pins';

export interface appPins {
    fieldWorkerId: number,
    pin: string,
    created: number;
    status: number;
    id: string;
}

export function usePinStorage() {
    const [store, setStore] = useState<Storage>();
    const [pin, setPin] = useState<appPins>();

    useEffect(()=>{
        const initStorage = async () => {
            const newStore = new Storage({
                name: 'pincodes'
            });
            
            const store = await newStore.create();
            setStore(store);

            const storedRemarks = await store.get(PIN_KEY) || null;
        
            setPin(storedRemarks);
        }
        initStorage();
    }, []);

    const addPin = async (fid:number,
                            passcode: string) => 
    {
        const newPin = {
            fieldWorkerId: fid,
            password: passcode,
            created: new Date().getTime(),
            status: 0,
            id: ''+new Date().getTime()
        }

        const updatedRemarks = newPin;
        await store?.set(PIN_KEY, updatedRemarks);
        const storedFollowups = await store?.get(PIN_KEY) || null
        setPin(storedFollowups);
    }

    const getPin = async() => {
        const sentPins = await store?.get(PIN_KEY) || null;
        // const requiredPin = sentPins.filter(fieldWorkerId === fid);
        return sentPins;
    }

    return {
        pin, addPin, getPin
    }
}