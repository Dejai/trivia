

import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useFetch } from '@/composables/useFetch'
import { defineStore } from 'pinia'
import Team from '@/models/Team'
import appConfig from '@/assets/config/app.json'

export const useTeamsStore = defineStore('teams', () => {

  const exampleTeams = [
    { Name: "Team Name 1", Code: "ABCD", "Answer": "answer 1", Score: 0, Wager:0 },
    { Name: "Team Name 2", Code: "EFXG", "Answer": "answer 2", Score: 0, Wager:1 },
    { Name: "Team Name 3", Code: "SDFD", "Answer": "answer 3", Score: 0, Wager:100 },
    { Name: "Team Name 4", Code: "AEWP", "Answer": "answer 4", Score: 0, Wager: 1000 }
  ]

  const route = useRoute()
  const gameID = route.params.gameID
  const teams = ref(exampleTeams.map( (x:any) => new Team(x)))
  const currentTeam = ref(new Team({}))

  // Get teams for this game
  async function getTeams(){
    let gameID = route.params.gameID
    let {data, error } = await useFetch("GET", `${appConfig.Urls.kv}/trivia/teams/?key=${gameID}`);
    if(data != undefined){
      teams.value = data.map( (x:any) => new Team(x))
    }

    // Adding example teams
    if(route.params.sessionID == "TEST" || route.params.sessionID == undefined){
      teams.value = teams.value.concat( exampleTeams.map( (x:any) => new Team(x)) )
    }
  }


  // Generate a team "key"
  function _getTeamKey(teamCode:string){
    let gameID = route.params.gameID;
    let sessionID = route.params.sessionID
    let teamKey =`${gameID}_${sessionID}_${teamCode}`
    return teamKey
  }

  // Create a new team
  async function createTeam(teamCode:string, teamName:string){
    let teamKey = _getTeamKey(teamCode);
    let createObj = { 
      key: teamKey, 
      code: teamCode,
      name: teamName, 
      value: "", 
      score: 0 
    }
    let { data, error } = await useFetch("POST", `${appConfig.Urls.kv}/trivia/team`, { body: JSON.stringify(createObj) } )
    if(data?.status == 200){
      currentTeam.value = new Team(data);
    }
  }

  async function getTeam(teamCode:string){
    let teamKey = _getTeamKey(teamCode);
    let { data, error } = await useFetch("GET", `${appConfig.Urls.kv}/trivia/team?key=${teamKey}`)
    if(data != undefined ){
      currentTeam.value = new Team(data);
    }
  }

  async function getTeamAnswers(){
    let gameID = route.params.gameID
    let { data, error } = await useFetch("GET", `${appConfig.Urls.kv}/trivia/team/answers/?key=${gameID}`)
    return data ?? [];
  }

  async function getTeamWagers(){
    let gameID = route.params.gameID
    let { data, error } = await useFetch("GET", `${appConfig.Urls.kv}/trivia/team/answers/?key=${gameID}`)
    if(data != undefined){
      for(let team of teams.value){
          let match = data.filter( (t:any) => t.code == team.Code)?.[0];
          if(match != undefined && match.wager != undefined){
            team.setWager(match.wager)
          }
      }
    }
    return data ?? [];
  }

  // Update a team
  async function updateTeam(team:Team){
    let teamKey = _getTeamKey(team.Code)
    let updateObj = { 
      key: teamKey,
      name: team.Name, 
      score: team.Score, 
      value: team.Answer,
      code: team.Code,
      wager: team.Wager
    }
    let { data, error } = await useFetch("POST", `${appConfig.Urls.kv}/trivia/team`, { body: JSON.stringify(updateObj) } )
    if(data != undefined){
      currentTeam.value = new Team(data);
    }
  }
    return { currentTeam, teams, getTeams, createTeam, getTeam, updateTeam, getTeamAnswers, getTeamWagers }
})
