import React, {useEffect, useState} from "react";
import "echarts/lib/chart/bar";
// 引入提示框和标题组件
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import api from '../../../config/api'
import axios from 'axios'

const echarts = require("echarts");

let myChart = [];
export default () => {
    const [list, setList] = useState([]);
    const [tmpData, setData] = useState({});

    const drew = (data, i) => {
        console.log(11111)
        const series = [
            {
                name: data.series[1].name,
                type: "bar",
                data: data.series[1].data,
                show: true,
            },
            {
                name: data.series[0].name,
                type: "line",
                smooth: true,
                yAxisIndex: 1,
                data: data.series[0].data,
            },
        ];
        const colors = ["#5470C6", "#91CC75", "#EE6666"];
        const option = {
            title: {
                text: data.title,
            },
            color: colors,
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                },
                formatter: function (params) {
                    console.log(params)
                    return "x : " + params[0].axisValue + '<br/>' +
                        params[1].seriesName + " : " + params[1].value + '<br/>' +
                        params[0].seriesName + " : " + params[0].value

                },
            },
            grid: {
                right: "20%",
            },
            toolbox: {
                feature: {
                    dataView: {show: true, readOnly: false},
                    restore: {show: true},
                    saveAsImage: {show: true},
                },
            },
            xAxis: [
                {
                    type: "category",
                    axisTick: {
                        alignWithLabel: true,
                    },
                    title: "hello",
                    align: "center",
                    // prettier-ignore
                    data: data.sub,

                },

            ],
            yAxis: [
                {
                    type: "value",
                    show: true,
                    min: 0,
                    max: data.series[1].max,
                    position: "right",
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colors[1],
                        },
                    },
                    axisLabel: {
                        formatter: "{value}",
                    },
                },
                {
                    type: "value",
                    min: 0,
                    max: data.series[0].max,
                    title: "hello",
                    showTitle: true,
                    position: "left",
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: colors[0],
                        },
                    },
                    nameTextStyle: {
                        align: "center",
                    },
                    axisLabel: {
                        formatter: "{value}",
                    },
                },
            ],
            series,
        };
        // 基于准备好的dom，初始化echarts实例
        myChart[i].setOption(
            {
                ...option,
            },
            200
        );
    };

    useEffect(() => {
        let feature = JSON.parse(localStorage.getItem('feature')).map(item => item.name)
        let file_path = localStorage.getItem('file_name')
        axios.post(api.getZhiFang, {feature, file_path}).then((res) => {
            console.log(res)
            if (res.data.code === 0) {
                let tmp = res.data.data.data
                setData(tmp)
            }
        })
    }, []);

    useEffect(() => {
        let list = [];
        for (let i = 0; i < tmpData.count; i++) {
            list[i] = (
                <div
                    key={i}
                    id={`graph-zhifangtu${i}`}
                    style={{width: "80vw", height: "80vh"}}
                />
            );
        }
        setList(list);
    }, [tmpData])

    useEffect(() => {
        if (list.length === 0) return;
        console.log(tmpData)
        for (let i = 0; i < tmpData.count; i++) {
            myChart[i] = echarts.init(document.getElementById(`graph-zhifangtu${i}`));
            drew(tmpData.data[i], i);
        }
    }, [list]);

    return <div>{list}</div>;
};
