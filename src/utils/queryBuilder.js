import {RunTransaction, Run} from "../utils/spanner";
/**
 * Query Builder Utility.
 */
class QueryBuilder  {

  constructor (tableName){
        this.tableName = tableName,
        this.sqlPrefixSelect = 'SELECT '
        this.sqlPrefixUpdate = 'UPDATE '
        this.sqlPrefixInsert = 'INSERT '
        this.sqlPrefixDelete = 'DELETE '
        this.sqlSelectAll = '*'
        this.sqlColumnConnector = ', '
        this.sqlFrom = ' FROM '
        this.sqlSet = ' SET '
        this.sqlValues = ' VALUES '
        this.sqlWhereClause = ' WHERE'
        this.sqlConditionEquals = ' = '
        this.sqlFiller = ' '
        this.sqlComma = ','
        this.sqlOpenBrc = '('
        this.sqlCloseBrc = ')'
        this.sqlQuery = ''
        this.sqlUpdate = true
  }

  select(params) {
      var selectedColumns = ''
      var column_count = 0
      this.sqlUpdate = false
      if(!params) {
          this.sqlQuery =  this.sqlPrefixSelect.concat(this.sqlSelectAll,this.sqlFrom, this.tableName)
          return this
      }
      else {
          for (var i=0; i<=params.length; i++) {
              if (i === params.length) {
                  this.sqlQuery = this.sqlPrefixSelect.concat(selectedColumns,this.sqlFrom, this.tableName)
                  return this
              }
              else {
                  if (column_count > 0) {
                      selectedColumns = selectedColumns.concat(this.sqlColumnConnector,params[i].column)
                  }
                  else {
                      selectedColumns = selectedColumns.concat(params[i].column)
                  }
                  column_count ++;
              }
          }
      }
  }

  update() {
      this.sqlQuery = this.sqlQuery.concat(this.sqlPrefixUpdate, this.tableName)
      return this
  }

  insert() {
      this.sqlQuery = this.sqlQuery.concat(this.sqlPrefixInsert, this.tableName)
      return this
  }

  delete() {
      this.sqlQuery = this.sqlQuery.concat(this.sqlPrefixDelete, this.sqlFrom, this.tableName)
      return this
  }

  set(params) {
      var setColumns = ''
      var set_Count = 0
      for (var i=0; i<=params.length;i++) {
          if (i === params.length) {
              this.sqlQuery = this.sqlQuery.concat(this.sqlSet,setColumns)
              return this
          }
          else {
              if (set_Count > 0) {
                  setColumns = setColumns.concat(this.sqlComma,params[i].column,params[i].literal,params[i].value)
              }
              else {
                  setColumns = setColumns.concat(params[i].column,params[i].literal,params[i].value)
              }
              set_Count++
          }
      }
  }

  columns(params) {
      var insertColumns = ''
      var insert_Count = 0
      for (var i=0; i<=params.length; i++) {
          if (i === params.length) {
              this.sqlQuery = this.sqlQuery.concat(this.sqlFiller,this.sqlOpenBrc,insertColumns,this.sqlCloseBrc)
              return this
          }
          else {
              if (insert_Count > 0) {
                  insertColumns = insertColumns.concat(this.sqlComma,params[i].column)
              }
              else {
                  insertColumns = insertColumns.concat(params[i].column)
              }
              insert_Count++
          }
      }
  }

  values(params) {
      var insertValues = ''
      var insert_Count = 0
      for (var i=0; i<=params.length; i++) {
          if (i === params.length) {
              this.sqlQuery = this.sqlQuery.concat(this.sqlValues,this.sqlOpenBrc,insertValues,this.sqlCloseBrc)
              return this
          }
          else {
              if (insert_Count > 0) {
                  insertValues = insertValues.concat(this.sqlComma,params[i].value)
              }
              else {
                  insertValues = insertValues.concat(params[i].value)
              }
              insert_Count++
          }
      }
  }

  where(params) {
      var conditionColumns = ''
      if (!params) {
          return this
      }
      else {
          for (var i=0; i<=params.length; i++) {
              if (i === params.length) {
                  this.sqlQuery = this.sqlQuery.concat(this.sqlWhereClause,conditionColumns)
                  return this
              }
              else {
                  conditionColumns = conditionColumns.concat(params[i].boo,this.sqlFiller,params[i].column,params[i].literal,params[i].value,this.sqlFiller)
              }
          }
      }
  }

  run() {
    if (this.sqlUpdate) {
      return RunTransaction(this.sqlQuery)
    } else {
      return Run(this.sqlQuery)
    }
  }
}

export default QueryBuilder;
