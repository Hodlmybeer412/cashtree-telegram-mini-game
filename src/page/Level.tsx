import { useEffect, useState } from "react";
import { useSelector, dispatch } from "../store";
import { updateEnergy,updateTapLevel,updateLimit } from "../store/reducers/wallet";
import {  levelTargets, energyLimit } from "../data";
import { levelNames, levels } from "../data";
import ProgressBar from "../component/ProgressBar";
import Footer from "../component/Footer";
export default function Level() {
    function formatNumberWithCommas(number: number, locale = "en-US") {
        return new Intl.NumberFormat(locale).format(number);
    }
    const tapLevelState = useSelector((state) => state.wallet.user?.tap_level);
    const [tapLevel, setTapLevel] = useState<number>(tapLevelState);


    const username_state = useSelector((state) => state.wallet.user?.username);
    const [username, ] = useState<string>(username_state);
    const [remainedEnergy, setRemainedEnergy] = useState<number>(5000);
    const [limit, setLimit] = useState<number>(0);
  
  
    const user = useSelector((state) => state.wallet.user);
  
    useEffect(() => {
      for (let i: number = 0; i < levelTargets.length; i++) {
        if (user.balance < levelTargets[i]) {
          dispatch(updateTapLevel(username, i));
          dispatch(updateLimit(username, energyLimit[i - 1]));
          setTapLevel(i);
          setLimit(energyLimit[i - 1]);
          break;
        }
      }
      console.log('====================================');
      console.log('user.balance', user.balance);
      console.log('Index', limit);
      console.log('tap_level', tapLevel);
      console.log('====================================');
      setRemainedEnergy(user.energy);
    },[])
  
    useEffect(() => {
      if (tapLevel != 0) {
        const interval = setInterval(() => {
          if (username && remainedEnergy < limit) {
            dispatch(updateEnergy(username, remainedEnergy + tapLevel));
            setRemainedEnergy(remainedEnergy + tapLevel);
          }
          // if (remainedEnergy > limit) {
          //   dispatch(updateEnergy(username, limit));
          //   setRemainedEnergy(limit);
          // }
        // }, (11 - tapLevel) * 1000);
        },  1000);
        return () => clearInterval(interval);
      }
    }, [username, remainedEnergy, limit, tapLevel]);
  
  

    
    useEffect(() => {
        setTapLevel(tapLevelState);
        
    }, [tapLevelState]);

    return (
        <div className="w-full h-full flex flex-col justify-between items-center">
            <div className="flex justify-between items-center px-3 w-full py-3">
                <img src="image/icon/back.png" alt="" className=" w-4 h-4" />
                <h3
                    className="text-sm text-[white]"
                    style={{ fontFamily: "archivo" }}
                >
                    Your Level
                </h3>
                <img src="image/icon/menu.png" alt="" className=" w-5 h-5" />
            </div>
            <div className="flex flex-col justify-center items-center gap-4 w-full">
                <div className="flex flex-col justify-center items-center">
                    <img src={`image/level/${levels[tapLevel - 1].icon}_b.png`} alt="" className=" w-[140px] h-[140px]" />
                    <h1 className="text-white text-[32px] font-bold">Level {levelNames[tapLevel - 1]}</h1>
                    <p className="text-[#F7BB12] text-sm">Up to {formatNumberWithCommas(levelTargets[tapLevel - 1])}</p>
                </div>
            </div>
            <div className="flex flex-col w-full justify-center items-center p-3 gap-2">
                <ProgressBar value={tapLevel * 10} />
                <div className="flex w-full justify-between items-center p-3">
                    <h1 className="text-[12px] text-white">Level: {levelNames[tapLevel - 1]}</h1>
                    <h1 className="text-[12px] text-white">Goal {tapLevel}/10</h1>
                </div>
            </div>
            <div className=" overflow-y-auto w-full max-h-[40vh]">
                <div className="flex flex-col justify-center items-center w-full gap-2">
                    <div className="flex justify-start items-center w-[90%] text-white text-xl font-bold">All Level</div>
                    {
                        levels.map((item, index) => (
                            <div
                                key={index}
                                className={`flex w-[90%] my-3 overflow-hidden relative px-3 py-3 items-center justify-between bg-[linear-gradient(315deg,_var(--tw-gradient-stops))] from-[#240C4D] to-[#8137F9] hover:bg-[linear-gradient(0.5turn, #711CD9, #CD3CFB)]  rounded-[20px] gap-2 border border-[#B286FA]`}>
                                {index == (tapLevel - 1) && <div className="w-1/3 h-[100px] z-0 absolute scale-110 skew-x-[22deg] -translate-x-20 bg-[linear-gradient(5deg,_var(--tw-gradient-stops))] from-[#4517A8] to-[#D940FF]"/>}
                                <div className="flex justify-center z-10 items-center gap-2">
                                    <img src={`/image/level/${item.icon}.png`} alt="" className="w-10 h-10" />
                                    <div className="flex flex-col gap-1 justify-start items-start">
                                        <h1 className="text-sm text-white">{item.name}</h1>
                                        <h1 className="text-[12px] text-white font-bold">
                                            Up to {formatNumberWithCommas(Number(item.target))} Points
                                        </h1>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1 justify-center items-center">
                                    <h1 className="text-[10px] text-[#C8A2FB]">Earn to level up</h1>
                                    <h1 className="text-sm font-bold text-white">+ {formatNumberWithCommas(Number(item.earn))}k</h1>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
} 