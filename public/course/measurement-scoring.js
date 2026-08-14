(()=>{
  const key={k01:1,k02:2,k03:0,k04:1,k05:1,k06:1,k07:1,k08:1,k09:1,k10:1,k11:1,k12:1};
  const scoreKnowledge=answers=>{
    const ids=Object.keys(key),answered=ids.filter(id=>Number.isFinite(Number(answers?.[id]))),correct=answered.filter(id=>Number(answers[id])===key[id]).length;
    return {answered:answered.length,correct,total:ids.length,pct:ids.length?Math.round(correct/ids.length*100):0};
  };
  window.NEXUS_MEASUREMENT_KEYS={scoreKnowledge};
})();
