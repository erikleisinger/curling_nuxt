<template>
<h1 class="q-pa-md">Hammer Efficiency</h1>
    <AnalyticsChart :data="heData" v-if="!isLoading && heData" />
    <q-separator class="q-my-md"/>

<h1 class="q-px-md">Steal Efficiency</h1>
    <AnalyticsChart :data="seData" v-if="!isLoading && seData" />
    <q-separator class="q-my-md"/>
    <h1 class="q-px-md">Force Efficiency</h1>

     <AnalyticsChart :data="feData" v-if="!isLoading && feData" />
    <q-separator class="q-my-md"/>
     <h1 class="q-px-md">Steal Defense</h1>

     <AnalyticsChart :data="sdData" v-if="!isLoading && sdData" />
       <q-separator class="q-my-md"/>

        <h1 class="q-px-md">Hammer efficiency + force efficiency</h1>

     <AnalyticsChart :data="feOverHeData" v-if="!isLoading && feOverHeData" />
       <q-separator class="q-my-md"/>

         <h1 class="q-px-md">Hammer efficiency & steal defense</h1>

     <AnalyticsChart :data="hfData" v-if="!isLoading && hfData" />
       <q-separator class="q-my-md"/>

           <h1 class="q-px-md">Hammer efficiency + steal efficiency + force efficiency + steal defense</h1>


     <AnalyticsChart :data="allData" v-if="!isLoading && allData" />
       <q-separator class="q-my-md"/>
    
</template>
<script setup>
    import {useQuery} from '@tanstack/vue-query';
    import {calcHammerEfficiency, calcStealEfficiency, calcForceEfficiency, calcStealDefense} from '@/store/models/stats/utils'


    const getAllTeamsAndStats = async () => {
        const client = useSupabaseClient();

        const {data} = await client.from('team_stats').select(`
            // team:team_id!inner (
            //     id,
            //     name,
            //     avatar_url
            // ),
            points_for,
            points_against,
            ends_for,
            ends_against,
            hammer_end_count,
            hammer_conversion_count,
            hammer_force_count,
            hammer_steal_count,
            non_hammer_end_count,
            non_hammer_conversion_count,
            non_hammer_force_count,
            non_hammer_steal_count,
            win,
            loss,
            tie,
            hammer_blank_count,
            non_hammer_blank_count,
            color,
            points_with_hammer,
            points_without_hammer,
            diff_3le,
            diff_2le,
            diff_le,
            hammer_le,
            ee,
            hammer_ee,
            early_end,
            start_time
        `)


        return data;
    }

    const {data, isLoading} = useQuery({
        queryKey: ['analytics'],
        queryFn: getAllTeamsAndStats,
        refetchOnWindowFocus: false,
    })

    const heData = computed(() => {
        if (!data.value) return null;
         const byHe = data.value.map((stat) => {
            return {
             ...stat,
            total: calcHammerEfficiency([stat])}
        }).reduce((all, current) => {
            if (!all[current.total]) all[current.total] = [];
            all[current.total].push(current)
            return all
        }, {})

        Object.entries(byHe).forEach(([k, v]) => {
            if (v.length < 4) delete byHe[k]
        })

        return {
            labels: Object.keys(byHe).map((k) => `${k}%`),
            datasets: [
                {
                    type: 'line',
                    label: 'Win percent',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: Object.values(byHe).map((arr) => {
                        const wins = arr.filter(({win}) => !!win);
                        return (wins.length / arr.length) * 100;
                    })
                }
            ]
        }
    })

     const seData = computed(() => {
        if (!data.value) return null;
         const byHe = data.value.map((stat) => {
            return {
             ...stat,
            total: calcStealEfficiency([stat])}
        }).reduce((all, current) => {
            if (!all[current.total]) all[current.total] = [];
            all[current.total].push(current)
            return all
        }, {})

        Object.entries(byHe).forEach(([k, v]) => {
            if (v.length < 4) delete byHe[k]
        })

        return {
            labels: Object.keys(byHe).map((k) => `${k}%`),
            datasets: [
                {
                    type: 'line',
                    label: 'Win percent',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: Object.values(byHe).map((arr) => {
                        const wins = arr.filter(({win}) => !!win);
                        return (wins.length / arr.length) * 100;
                    })
                }
            ]
        }
    })

      const feData = computed(() => {
        if (!data.value) return null;
         const byHe = data.value.map((stat) => {
            return {
             ...stat,
            total: calcForceEfficiency([stat])}
        }).reduce((all, current) => {
            if (!all[current.total]) all[current.total] = [];
            all[current.total].push(current)
            return all
        }, {})

        Object.entries(byHe).forEach(([k, v]) => {
            if (v.length < 4) delete byHe[k]
        })

        return {
            labels: Object.keys(byHe).map((k) => `${k}%`),
            datasets: [
                {
                    type: 'line',
                    label: 'Win percent',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: Object.entries(byHe).sort(([a], [b]) => a - b).map(([key, arr]) => {
                        const wins = arr.filter(({win}) => !!win);
                        return (wins.length / arr.length) * 100;
                    })
                }
            ]
        }
    })

       const sdData = computed(() => {
        if (!data.value) return null;
         const byHe = data.value.map((stat) => {
            return {
             ...stat,
            total: calcStealDefense([stat])}
        }).reduce((all, current) => {
            if (!all[current.total]) all[current.total] = [];
            all[current.total].push(current)
            return all
        }, {})

        Object.entries(byHe).forEach(([k, v]) => {
            if (v.length < 4) delete byHe[k]
        })

        return {
            labels: Object.keys(byHe).map((k) => `${k}%`),
            datasets: [
                {
                    type: 'line',
                    label: 'Win percent',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: Object.entries(byHe).sort(([a], [b]) => a - b).map(([key, arr]) => {
                        const wins = arr.filter(({win}) => !!win);
                        return (wins.length / arr.length) * 100;
                    })
                }
            ]
        }
    })

        const feOverHeData = computed(() => {
        if (!data.value) return null;
         const byHe = data.value.map((stat) => {
            return {
             ...stat,
            total: (calcHammerEfficiency([stat]) + calcForceEfficiency([stat])) / 2}
        }).reduce((all, current) => {
            if (!all[current.total]) all[current.total] = [];
            all[current.total].push(current)
            return all
        }, {})

        Object.entries(byHe).forEach(([k, v]) => {
            if (v.length < 4) delete byHe[k]
        })


        return {
            labels: Object.keys(byHe).map((k) => `${k}%`).sort((a,b) => Number(a) - Number(b)),
            datasets: [
                {
                    type: 'line',
                    label: 'Win percent',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: Object.entries(byHe).sort(([a],[b]) => a - b).map(([key, arr]) => {

                        const wins = arr.filter(({win}) => !!win);
                        return (wins.length / arr.length) * 100;
                    })
                }
            ]
        }
    })

         const hfData = computed(() => {
        if (!data.value) return null;
         let byHe = data.value.map((stat) => {
            return {
             ...stat,
            total: (calcHammerEfficiency([stat]) + calcStealDefense([stat])) / 2,
              total: calcHammerEfficiency([stat]) - (100 - calcStealDefense([stat])),
            }
        })
        
        byHe = byHe.reduce((all, current) => {
            if (!all[current.total]) all[current.total] = [];
            all[current.total].push(current)
            return all
        }, {})
       
        Object.entries(byHe).forEach(([k, v]) => {
            if (v.length < 4) delete byHe[k]
        })



        return {
            labels: Object.keys(byHe).map((k) => `${k}%`).sort((a,b) => Number(a) - Number(b)),
            datasets: [
                {
                    type: 'line',
                    label: 'Win percent',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: Object.entries(byHe).sort(([a],[b]) => Number(a) - Number(b)).map(([key, arr]) => {
                        const wins = arr.filter(({win}) => !!win);
                     
                        return (wins.length / arr.length) * 100;
                    })
                }
            ]
        }
    })

         const allData = computed(() => {
        if (!data.value) return null;
         const byHe = data.value.map((stat) => {
            return {
             ...stat,
            total: (calcHammerEfficiency([stat]) + calcStealDefense([stat]) + calcForceEfficiency([stat]) + calcStealEfficiency([stat])) / 4,
            }
        }).reduce((all, current) => {
            if (!all[current.total]) all[current.total] = [];
            all[current.total].push(current)
            return all
        }, {})

        Object.entries(byHe).forEach(([k, v]) => {
            if (v.length < 4) delete byHe[k]
        })



        return {
            labels: Object.keys(byHe).map((k) => `${k}%`).sort((a,b) => Number(a) - Number(b)),
            datasets: [
                {
                    type: 'line',
                    label: 'Win percent',
                    backgroundColor: 'rgb(0, 0, 0)',
                    borderColor: 'rgb(255, 0, 0)',
                    data: Object.entries(byHe).sort(([a],[b]) => Number(a) - Number(b)).map(([key, arr]) => {
                        const wins = arr.filter(({win}) => !!win);
                     
                        return (wins.length / arr.length) * 100;
                    })
                }
            ]
        }
    })


</script>