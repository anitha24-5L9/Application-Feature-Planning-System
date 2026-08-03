import { useEffect, useState } from "react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";


import { getAnalytics } from "../services/analyticsService";

import "../styles/EvaluationChart.css";


export default function EvaluationChart({ flagKey, refresh }) {


    const [data, setData] = useState([]);


    useEffect(() => {
    loadAnalytics();
}, [flagKey, refresh]);



    const loadAnalytics = async () => {

        try {

            const analytics = await getAnalytics();


            const filtered = analytics
                .filter(
                    item => item.flag_key === flagKey
                )
                .map(item => ({
                    date:
                    `${item.date} ${item.hour}:00`,
                    count:
                    item.evaluation_count
                }));


            setData(filtered);


        } catch(error){

            console.error(
                "Analytics loading failed",
                error
            );

        }

    };



    return (

        <div className="analytics-container">


            <h3>
                Evaluation Count Analytics
            </h3>


            {
                data.length === 0 ?

                (
                    <p>
                        No evaluation data available.
                    </p>
                )

                :

                (

                <ResponsiveContainer
                    width="100%"
                    height={300}
                >

                    <LineChart data={data}>


                        <CartesianGrid />

                        <XAxis
                            dataKey="date"
                        />


                        <YAxis />


                        <Tooltip />


                        <Line
                            type="monotone"
                            dataKey="count"
                            strokeWidth={3}
                        />


                    </LineChart>


                </ResponsiveContainer>

                )

            }


        </div>

    );

}


