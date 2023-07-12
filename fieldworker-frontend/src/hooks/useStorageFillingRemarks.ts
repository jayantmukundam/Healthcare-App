// Implementing custom hook
import { useEffect, useState } from "react";
import { Storage } from "@ionic/storage";

const REMARKS_KEY = 'followup-remarks';

export interface FollowUpRemarks {
    followUp:object,
    urgentFlag: boolean;
    isActive: number;
    taskAssignedByDoctor: string;
    reviewByFieldWorker: string;
    created: number;
    status: number;
    id: string;
}

export function useStorageFillingRemarks() {
    const [store, setStore] = useState<Storage>();
    const [remarks, setRemarks] = useState<FollowUpRemarks[]>([]);

    useEffect(()=>{
        const initStorage = async () => {
            const newStore = new Storage({
                name: 'hadDB'
            });
            
            const store = await newStore.create();
            setStore(store);

            const storedRemarks = await store.get(REMARKS_KEY) || [];
            setRemarks(storedRemarks);
        }
        initStorage();
    }, []);

    const addRemark = async (urgentFlag: boolean,
                            isActive: number,
                            taskAssignedByDoctor: string,
                            reviewByFieldWorker: string,
                            follow_up: object,
                            prescription: string,
                            symptoms: string) => 
    {
        const newRemark = {
            followUp:follow_up,
            urgentFlag,
            isActive,
            taskAssignedByDoctor,
            reviewByFieldWorker,
            prescription,
            symptoms,
            created: new Date().getTime(),
            status: 0,
            id: ''+new Date().getTime()
        }
        // console.log(updatedRemarks);
        // setRemarks(updatedRemarks);
        // console.log(remarks[remarks.length-1])

        const updatedRemarks = [...remarks, newRemark];
        await store?.set(REMARKS_KEY, updatedRemarks);
        const storedFollowups = await store?.get(REMARKS_KEY) || []
        setRemarks(storedFollowups);
    }

    const getRemarks = async() => {
        const sentRemarks = await store!.get(REMARKS_KEY) || [];
        return sentRemarks;
    }

    const updateRemarks = async(downRemarks: any) => {
        await store?.set(REMARKS_KEY, downRemarks);
    }

    return {
        remarks, addRemark, getRemarks, updateRemarks
    }
}