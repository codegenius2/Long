import {LongException} from './exception/error';
import {LongNumber} from './tokens/number';
import {LongString} from './tokens/strings';
import {Token, operators, builtinFunctions} from './tokens/token';
/**
 * The position or the index in the
 * string data read from the specified
 * filename
 *
 * Contains a position(which is the index),
 * and a tail[boolean] (end of the file or not)
 */
export interface Position {
  position: number;
  tail: boolean;
}

export interface TokenAnalyse {
  position: number;
  data: string;
  lineNumber: number;
}

/**
 *
 *
 * @param {String} fileData The data in the file
 * @param {Position} position The current position of the lexer
 * in the whole string
 * @param {String | null} character The current character
 *
 */
export class LongLexicalAnalyser {
  private readonly fileData: string;
  private position: Position;
  private character: string | null;
  private tokens: Array<Token> = new Array();

  private command: Array<Array<Token>> = new Array();

  private lineNumber: number = 1;
  /**
   * @constructor
   * @param fileData the data in the file
   */
  constructor(fileData:string) {
    this.fileData = fileData.toString();
    this.position = {position: 0, tail: false};
    this.character = this.setCurrentCharacter();
  }

  /**
   * @private
   *
   * @returns {String | null} the current character or null
   */
  public setCurrentCharacter = (): string | null => {
    if (this.position.position == this.fileData.length) {
      this.position.tail = true;
      return null;
    } else {
      return this.fileData[this.position.position];
    }
  };

  /**
   * @public
   *
   * @returns the tokens and list of exceptions
   */
  public createLexicalAnalyser = (): any => {
    this.character = this.setCurrentCharacter();
    while (this.character != null) {
      if (this.character == ' ') {
        // if we find a space character(end of a command)
        // append the current list of tokens to the list
        // of commands and clear the token(only if the token list
        // is not empty)
        if (this.tokens.length >= 0) {
          this.command.push(this.tokens);
          this.tokens = new Array();
        }
      } else if (Number.isInteger(parseInt(this.character))) {
        // else, if the character converted to an integer
        // is not **NaN**, we take it as a number a try
        // to produce a new number
        const number = new LongNumber({
          position: this.position.position,
          data: this.fileData,
          lineNumber: this.lineNumber,
        });
        const numberInfo = number.createNumberToken();

        // updating the position so that the lexer continues
        // to tokenise after the number ends
        this.position.position = numberInfo.position - 1;

        this.tokens.push({
          tokenType: 'number',
          tokenData: numberInfo.number,
        });
      } else if (this.character == '"') {
        // if the character is a quotation("")[The start of a string]
        // keep track of the string till the string ends with
        // another quotation mark and update the position
        // and also add the new token to the token array

        const string = new LongString(this.fileData, this.position.position);
        const stringInfo = string.createLongString();

        this.position.position = stringInfo.pos - 1;
        this.tokens.push({
          tokenType: stringInfo.data.length == 1 ? 'char' : 'string',
          tokenData: stringInfo.data.toString(),
        });
      } else if (this.character == '\n') {
        // update the line number count if the lexer
        // encounter a newline character
        this.lineNumber += 1;
      } else if (operators.includes(this.character)) {
        // if the current character is present in the array
        // of operators(the character is an operator),
        // append it to the token list
        this.tokens.push({
          tokenType: 'operator',
          tokenData: this.character,
        });
      } else if (Object.keys(builtinFunctions).includes(this.character)) {
        // if the character is present in the keys of
        // the builtin character(#, !) push to
        // token array with the type specified in the dict
        this.tokens.push({
          tokenType: builtinFunctions[this.character].type,
          tokenData: this.character,
        });
      }

      this.position.position += 1;
      this.character = this.setCurrentCharacter();
    }

    return this.command;
  };
}
