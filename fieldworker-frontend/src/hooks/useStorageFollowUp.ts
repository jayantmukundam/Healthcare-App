import { useEffect, useState } from "react";
import {Storage} from '@ionic/storage';

export function useStorageFollowUp() {
    const[store, setStore]= useState<Storage>();
    const[followups, setFollowups] = useState<any[]>([]);

    useEffect(() => {
        const initStorage =async () => {
            const newStorage = new Storage({
                name : 'followupsDB'
            });
            const store = await newStorage.create();
            setStore(store);

            const storedFollowups = await store.get('my-followups') || []
            setFollowups(storedFollowups);
        }
        initStorage();
    
    }, []);

    
    const addFollowups = async(fups: any) => {
        console.log(fups);
        await store?.set('my-followups', fups)
        const storedFollowups = await store?.get('my-followups') || []
        setFollowups(storedFollowups);
    }

    const updateFollowUp = async(id: number) => {
        const toUpdate = [...followups];
        // console.log(id);
        let fup = await toUpdate.filter(fup => fup.followUpId === id)[0];
        console.log(fup);
        fup.isActive = 2;

        await store?.set('my-followups', toUpdate);
        // setFollowups(toUpdate);
        // return store?.set('my-followups', toUpdate);
    }

    // const getFollowups = async() => {
    //     const storedFollowups = await store?.get('my-followups') || [];
    //     setFollowups(storedFollowups)
    //     return followups;
    // }

    const getFollowups = async() => {
        const sentFollowUps = await store!.get('my-followups') || [];
        return sentFollowUps;
    }

    return {
        followups,
        addFollowups,
        updateFollowUp,
        getFollowups
    }
}