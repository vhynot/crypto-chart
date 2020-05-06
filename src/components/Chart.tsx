import React, {useState, useEffect} from "react"
import {AreaChart, Area, XAxis, YAxis, Tooltip} from "recharts"

const Chart: React.FC = () => {
    const currentTimestamp: number = Math.floor( new Date().getTime()/1000);
    const BASE_CRYPTO: string = `USDT`;
    const CRYPTO: string = `ETH`
    // const days: number = 90;   //max 90
    const day: number = 24*60*60;
    const week: number = 7*day;
    const weeks: number = 143;   //max 143
    const [xAxis, setXAxis] = useState<string[]>([]);
    const [yAxis, setYAxis] = useState<number[]>([]);
    const [dataSet, setDataSet] = useState<object[]>([]);

    function converteUnixToDate(arr: number[]) {
        const anotherArr: string[] = arr.map((item: number) => {
            let options = {year: '2-digit', month: 'short', day: 'numeric'}
            let d = new Date(item*1000).toLocaleDateString('us-US', options).replace(',', '');
            let m1: string = '';
            let d1: string = '';
            let y1: string = '';
            [m1,d1,y1] = d.split(" ");
            return `${d1} ${m1} '${y1}`
        })
        setXAxis(anotherArr);
    }

    const fetchItems = async () => {
        const API_KEY: string | number | undefined = process.env.REACT_APP_API_KEY;
        let TIMEFRAMES: string = `W`;
        let UNIX_FROM: string = `${currentTimestamp - (weeks*week)}`;
        let UNIX_TO: number = currentTimestamp;
        // let API_CALL_CURRENCY_LIST: string = `https://finnhub.io/api/v1/crypto/symbol?exchange=binance&token=${API_KEY}`
        let API_CALL_CRYPTO_VALUE: string = `https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:${CRYPTO}${BASE_CRYPTO}&resolution=${TIMEFRAMES}&from=${UNIX_FROM}&to=${UNIX_TO}&token=${API_KEY}`
        let response = await fetch(API_CALL_CRYPTO_VALUE);
        let data = await response.json();
        setYAxis(data.o); 
        console.log(data.o)
    }
    function createXAxis() {
        let newArr: number[] = [currentTimestamp];
        let value: number = currentTimestamp;
        for(let i = 1; i < weeks; i++){
            newArr.push(value - week);
            value = value - week;
        }
        newArr.reverse() 
        converteUnixToDate(newArr);
    }
    
    useEffect(() => {
        fetchItems()
        createXAxis()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentTimestamp])

    useEffect(() => {
        const data = [];
        for (let i = 0; i< xAxis.length; i++){
            data.push({Date: xAxis[i], Value: yAxis[i]})
        }
        setDataSet(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yAxis])
    
    return (
        <div className="chart">
            <div className="chart__title">{CRYPTO} / {BASE_CRYPTO}</div>
            <AreaChart
                width={1000}
                height={400}
                data={dataSet}
                margin={{
                top: 5, right: 30, left: 20, bottom: 5,
                }}
            
            >
                <defs>
                    <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="Date" />
                <YAxis unit={BASE_CRYPTO === `USDT` ? ` $` : ``}/>
                <Tooltip />
                <Area
                    type="monotone" 
                    dataKey="Value" 
                    activeDot={{ r: 3 }} 
                    stroke='#8884d8'
                    fillOpacity={1}
                    fill='url(#color)'
                />
            </AreaChart>
        </div>
    )
}

export default Chart