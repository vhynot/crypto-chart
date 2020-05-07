import React, {useState, useEffect} from "react"
import {AreaChart, Area, XAxis, YAxis, Tooltip} from "recharts"

const Chart: React.FC = () => {
    const currentTimestamp: number = Math.floor( new Date().getTime()/1000);
    const day: number = 24*60*60;
    const week: number = 7*day;
    const month: number = 30*day;
    let days: number = 30;   //max 90
    let weeks: number = 54;   //max 143
    let months: number = 48;
    const [xAxis, setXAxis] = useState<string[]>([]);
    const [yAxis, setYAxis] = useState<number[]>([]);
    const [dataSet, setDataSet] = useState<object[]>([]);
    const [periodOption, setPeriodOption] = useState<string>(`1Y`);
    const [baseCrypto, setBaseCrypto] = useState<string>('USDT');
    const [crypto, setCrypto] = useState<string>('BTC')
    const [timeFrame, setTimeFrame] = useState<string>('W')
    const [timePeriod, setTimePeriod] = useState<number>(weeks*week);
    const [baseTimeframe, setBaseTimeframe] = useState<number>(week);
    
    function converteUnixToDate(arr: number[]) {
        const anotherArr: string[] = arr.map((item: number) => {
            let options1 = {year: '2-digit', month: 'short', day: 'numeric'};
            let options2 = {year: '2-digit', month: 'short', day: 'numeric'}
            let d = new Date(item*1000).toLocaleDateString('us-US', options1).replace(',', '');
            let t = new Date(item*1000).toLocaleTimeString('us-US', options2)
            let m1: string = '';
            let d1: string = '';
            let y1: string = '';
            [m1,d1,y1] = d.split(" ");
            return `${d1} ${m1} '${y1}`
        })
        setXAxis(anotherArr);
    }
    
    const fetchItems = async (baseCrypto: string, crypto: string, timeFrame: string, timePeriod: number) => {
        const API_KEY: string | number | undefined = process.env.REACT_APP_API_KEY;
        let UNIX_FROM: string = `${currentTimestamp - timePeriod}`;
        let UNIX_TO: number = currentTimestamp;
        let BASE_CRYPTO: string = baseCrypto;
        let CRYPTO: string = crypto;
        let TIMEFRAMES: string = timeFrame;
        // let API_CALL_CURRENCY_LIST: string = `https://finnhub.io/api/v1/crypto/symbol?exchange=binance&token=${API_KEY}`
        let API_CALL_CRYPTO_VALUE: string = `https://finnhub.io/api/v1/crypto/candle?symbol=BINANCE:${CRYPTO}${BASE_CRYPTO}&resolution=${TIMEFRAMES}&from=${UNIX_FROM}&to=${UNIX_TO}&token=${API_KEY}`
        let response = await fetch(API_CALL_CRYPTO_VALUE);
        let data = await response.json();
        setYAxis(data.o); 
        console.log(data.o.length)
    }
    function createXAxis(baseTimeframe: number) {
        let newArr: number[] = [currentTimestamp];
        let value: number = currentTimestamp;
        for(let i = 1; i < yAxis.length; i++){
            newArr.push(value - baseTimeframe);
            value = value - baseTimeframe;
        }
        newArr.reverse() 
        converteUnixToDate(newArr);
    }
    
    useEffect(() => {
        switch(periodOption){
            case "1H":
                console.log('1H')
                break;
            case "1D":
                console.log('1D')
                break;
            case "1W":
                console.log('1W')
                setTimeFrame('D');
                setTimePeriod(day*days);
                setBaseTimeframe(day);
                break;
            case "1M":
                console.log('1M')
                setTimeFrame('D');
                setTimePeriod(day*days);
                setBaseTimeframe(day);
                break;
            case "1Y":
                console.log('1Y')
                setTimeFrame('W');
                setTimePeriod(week*weeks);
                setBaseTimeframe(week);
                break;
            case "ALL":
                console.log('ALL')
                setTimeFrame('M');
                setTimePeriod(month*months);
                setBaseTimeframe(month);
                break;
            default:
                setTimeFrame('W');
                setTimePeriod(week*weeks);
                setBaseTimeframe(week);
        }
        fetchItems(baseCrypto, crypto, timeFrame, timePeriod)
        console.log('action')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[periodOption])
    
    useEffect(() => {
        if ((yAxis.length) > 0) {
            console.log(baseTimeframe, week, "second")
            createXAxis(baseTimeframe)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [yAxis])
    
    useEffect(() => {
        if ((xAxis.length) > 0) {
            const data: object[] = [];
            for (let i = 0; i < yAxis.length; i++){
                data.push({Date: xAxis[i], Value: yAxis[i]})
            }
            setDataSet(data)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [xAxis])

    return (
        <div className="chart">
            <div className="chart__title">ETH / USDT</div>
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
                <YAxis unit={` $`}/>
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
            <div className="period-selector">
            <div className={`period-selector__option ${periodOption === "1H" ? 'period-selector__option--active' : ''}`} onClick={() => setPeriodOption("1H")}>
                    <span>1H</span>
                </div>
                <div className={`period-selector__option ${periodOption === "1D" ? 'period-selector__option--active' : ''}`} onClick={() => setPeriodOption("1D")}>
                    <span>1D</span>
                </div>
                <div className={`period-selector__option ${periodOption === "1w" ? 'period-selector__option--active' : ''}`} onClick={() => setPeriodOption("1W")}>
                    <span>1W</span>
                </div>
                <div className={`period-selector__option ${periodOption === "1M" ? 'period-selector__option--active' : ''}`} onClick={() => setPeriodOption("1M")}>
                    <span>1M</span>
                </div>
                <div className={`period-selector__option ${periodOption === "1Y" ? 'period-selector__option--active' : ''}`} onClick={() => setPeriodOption("1Y")}>
                    <span>1Y</span>
                </div>
                <div className={`period-selector__option ${periodOption === "ALL" ? 'period-selector__option--active' : ''}`} onClick={() => setPeriodOption("ALL")}>
                    <span>ALL</span>
                </div>
            </div>
        </div>
    )
}

export default Chart