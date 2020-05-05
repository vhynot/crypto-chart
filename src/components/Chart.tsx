import React, {useState, useEffect} from "react"
import {LineChart, Line, CartesianGrid, XAxis, YAxis} from "recharts"

const Chart: React.FC = () => {
    const currentTimestamp: number = Math.floor( new Date().getTime()/1000);
    const [xAxis, setXAxis] = useState<string[]>([]);
    const [yAxis, setYAxis] = useState<number[]>([]);
    const [dataSet, setDataSet] = useState<object[]>([]);

    function converteUnixToDate(arr: number[]) {
        const anotherArr: string[] = arr.map((item: number) => {
            let date: string = new Date(item*1000).toLocaleDateString("de-DE");
            return date
        })
        setXAxis(anotherArr);
    }

    
    useEffect(() => {
        function createXAxis() {
            let newArr: number[] = [currentTimestamp];
            let value: number = currentTimestamp;
            for(let i = 0; i < 6; i++){
                newArr.push(value - 24*60*60);
                value = value - 24*60*60;
            }
            newArr.reverse() 
            converteUnixToDate(newArr);
        }
        const fetchItems = async () => {
            const API_KEY: string | number | undefined = process.env.REACT_APP_API_KEY;
            let SYMBOL: string = `BTCUSDT`;
            let TIMEFRAMES: string = `D`;
            let UNIX_FROM: number = currentTimestamp - 7*24*60*60;
            let UNIX_TO: number = currentTimestamp;
            let API_CALL: string = `https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:${SYMBOL}&resolution=${TIMEFRAMES}&from=${UNIX_FROM}&to=${UNIX_TO}&token=${API_KEY}`
            let response = await fetch(API_CALL);
            let data = await response.json();
            setYAxis(data.o); 
        }
        createXAxis()
        fetchItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[currentTimestamp])

    useEffect(() => {
        const data = [];
        for (let i = 0; i< xAxis.length; i++){
            data.push({x: xAxis[i], y: yAxis[i]})
        }
        setDataSet(data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yAxis])
    
    return (
        <div className="chart">
            <LineChart width={800} height={400} data={dataSet}>
                <Line type="monotone" dataKey="y" stroke="#8884d8"/>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="x"/>
                <YAxis />
            </LineChart>
        </div>
    )
}

export default Chart