import chalk from 'chalk'

export function printSuccess(message) {
  console.log('  ' + chalk.green('✓') + '  ' + message)
}

export function printError(message) {
  console.error('  ' + chalk.red('✗') + '  ' + message)
}

export function printEpic(title, body) {
  console.log()
  console.log('  ' + chalk.bold.cyan('⚔  ' + title))
  if (body) {
    const lines = body.split('\n')
    for (const line of lines) {
      console.log('  ' + chalk.dim(line))
    }
  }
  console.log()
}

export function printSection(title, content) {
  console.log()
  console.log('  ' + chalk.bold.white(title))
  if (content) {
    const lines = content.split('\n')
    for (const line of lines) {
      console.log('  ' + chalk.dim(line))
    }
  }
}
