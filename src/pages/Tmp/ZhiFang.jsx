import React, {useEffect, useState} from "react";
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";

const echarts = require("echarts");

let myChart = [];
export default () => {
    const [list, setList] = useState([]);
    const tmpData = {
        "count": 2,
        "data": [{
            "title": "campaign的直方图",
            "sub": [2.4111, 3.8111, 5.1111, 6.6111, 8.0111, 9.4111, 10.811, 12.201, 13.611, 15],
            "series": [{
                "name": "campaign_1",
                "data": [1245, 477, 376, 83, 77, 14, 8, 8, 1, 1],
                "max": 1400
            }, {
                "name": "campaign_2",
                "data": [0.9413514838512061, 0.98698118794029, 0.7981758536756669, 0.49787571459408475, 0.23953884271337436, 0.08889218843002318, 0.025443912670073763, 0.005617419290652866, 0.0009565825039203486, 0.00012564368697576581],
                "max": 1
            }]
        }, {
            "title": "duration的直方图",
            "sub": [4.0, 7.0, 10.0, 13.0, 16.0, 19.0, 22.0, 25.0, 28.0, 31.0],
            "series": [{
                "name": "duration_1",
                "data": [486, 570, 346, 618, 553, 655, 472, 121, 223, 290],
                "max": 720
            }, {
                "name": "duration_2",
                "data": [0.93, 0.960, 0.98, 0.9957, 0.999, 0.995, 0.98, 0.958, 0.928, 0.89],
                "max": 1
            }]
        }]
    }

    const drew = (data, i) => {
        const series = [
            {
                name: data.series[1].name,
                type: 'bar',
                data: data.series[1].data,
                show: true
            },
            {
                name: data.series[0].name,
                type: 'line',
                yAxisIndex: 1,
                data: data.series[0].data,
            }
        ]
        const colors = ['#5470C6', '#91CC75', '#EE6666'];
        const option = {
            title: {
                text: data.title,
            },
            color: colors,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            grid: {
                right: '20%'
            },
            toolbox: {
                feature: {
                    dataView: { show: true, readOnly: false },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },

            xAxis: [
                {
                    type: 'category',
                    axisTick: {
                        alignWithLabel: true
                    },
                    title: "hello",
                    align:"center",
                    name: "test1",
                    // prettier-ignore
                    data: data.sub
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    show:true,
                    min: 0,
                    max: data.series[1].max,
                    position: 'right',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colors[1]
                        }
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    min: 0,
                    max: data.series[0].max,
                    title: "hello",
                    showTitle:true,
                    position: 'left',
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colors[0]
                        }
                    },
                    nameTextStyle:{
                        align: "center"
                    },
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series
        };
        // 基于准备好的dom，初始化echarts实例
        myChart[i].setOption(
            {
                ...option,
            },
            200
        );
    }

    useEffect(() => {
        let list = []
        for (let i = 0; i < tmpData.count; i++) {
            list[i] = <div key={i} id={`graph-zhifangtu${i}`} style={{width: "80vw", height: "60vh"}}/>
        }
        setList(list);
    }, [])

    useEffect(() => {
        if (list.length === 0) return;
        for (let i = 0; i < tmpData.count; i++) {
            myChart[i] = echarts.init(document.getElementById(`graph-zhifangtu${i}`));
            drew(tmpData.data[i], i);
        }
    }, [list])


    return <div>{list}</div>;
}
