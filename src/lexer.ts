/**
 * Grammer
 * 
 * expr  :  name ((COMMA, LINK) name)*
 * 
 * name  :  string
 * 
 */



class NixError {

    constructor(public posStart: number, public posEnd: number, public errorName: string, public details: any) {}
    
    toString() {
        let result = `${this.errorName}: ${this.details}\n`;
        // implement this \/\\/\/\/\/\\
        // result += '\n\n' + string_with_arrows(self.pos_start.ftxt, self.pos_start, self.pos_end)
        return result
    }
}
    
class IllegalCharError extends NixError {
    constructor(public posStart: number, public posEnd: number, public details: any){
        super(posStart, posEnd, 'Illegal Character', details)
    }
    
}
class InvalidSyntaxError extends NixError {
    constructor(public posStart: number, public posEnd: number, public details: any=''){
        super(posStart, posEnd, 'Invalid Syntax', details)
    }
    
}

const TT_STRING = "STRING";
const TT_LPAR = "LPAR";
const TT_RPAR = "RPAR";
const TT_ARROW = "ARROW";
const TT_COMMA = "COMMA";
const TT_EOF = 'EOF';
class Token {
    constructor(public type: string, public value: any = null, public posStart: any = null, public posEnd: any = null) {
        if (posStart != null) {
            this.posEnd = this.posStart + 1;
        }
    }
}

class Lexer {
    public pos = -1;
    public currentChar: string | null = null;

    constructor(public text: string) {
        this.advance();
    }

    advance() {
        this.pos += 1;
        this.currentChar =
            this.pos < this.text.length ? this.text[this.pos] : null;
    }

    isLetter(str: string) {
        return /^[a-zA-Z]$/.test(str);
    }

    makeTokens() {
        let tokens: Token[] = [];

        while (this.currentChar != null) {
            if (this.currentChar == " ") {
                this.advance();
            } else if (this.isLetter(this.currentChar)) {
                tokens.push(this.makeString());
            } else if (this.currentChar == "-") {
                tokens.push(new Token(TT_ARROW, null, this.pos));
                this.advance();
            } else if (this.currentChar == ",") {
                tokens.push(new Token(TT_COMMA, null, this.pos));
                this.advance();
            } else if (this.currentChar == "[") {
                tokens.push(new Token(TT_LPAR, null, this.pos));
                this.advance();
            } else if (this.currentChar == "]") {
                tokens.push(new Token(TT_RPAR, null, this.pos));
                this.advance();
            } else {
                throw Error("invalid token: " + this.currentChar);
            }
        }
        tokens.push(new Token(TT_EOF, null, this.pos));
        return tokens;
    }

    makeString() {
        let str = "";
        let posStart = this.pos;

        while (this.currentChar != null && this.isLetter(this.currentChar)) {
            str += this.currentChar;
            this.advance();
        }
        return new Token(TT_STRING, str, posStart, this.pos);
    }
}

class NameNode {
    constructor(
        public token: Token
    ) {}
}

class BinOpNode {
    constructor(
        public leftNode: any,
        public operationToken: Token,
        public rightNode: any
    ) { }
}

class ParseResult {
    constructor(public error: any = null, public node: any = null) { }
    
    register(result: any) {
        if (result instanceof ParseResult) {
            if (result.error != null) {
                this.error = result.error;
            }
            return result.node
        }
        return result;
    }

    success(node: any) {
        this.node = node;
        return this;
    }

    failure(error: any) {
        this.error = error;
        return this;
    }
}

class Parser {
    public tokenIndex: number;
    public currentToken: Token | null;

    constructor(
        public tokens: Token[],
    ) {
        this.tokenIndex = -1;
        this.currentToken = null;
        this.advance();
    }

    advance() {
        this.tokenIndex++;
        if (this.tokenIndex < this.tokens.length) {
            this.currentToken = this.tokens[this.tokenIndex];
        }
        return this.currentToken;
    }

    parse() {
        let result = this.expression();
        if (result.error == null && this.currentToken?.type != TT_EOF) {
            return result.failure(new InvalidSyntaxError(
                this.currentToken?.posStart, this.currentToken?.posEnd, 'expected , or -'
            ))
        }
        return result;
    }

    expression(): any {
        let result = new ParseResult();
        let left: any = result.register(this.name()!);
        if (result.error != null) {return result};

        while (this.currentToken?.type == TT_COMMA || this.currentToken?.type == TT_ARROW) {
            let exprToken = this.currentToken;
            result.register(this.advance());
            let right = result.register(this.name());
            if (result.error != null) { return result }
            left = new BinOpNode(left, exprToken, right);
        }
        if (left instanceof NameNode) throw Error('something didnt work');
        return result.success(left);
    }

    name(): ParseResult {
        let result = new ParseResult()
        if (this.currentToken!.type != TT_STRING)
            return result.failure(new InvalidSyntaxError(this.currentToken?.posStart, this.currentToken?.posEnd, "Expected schema name"));
        result.register(this.advance());
        return result.success(new NameNode(this.currentToken!));
    }

}

export default (command: string) => { 
    let l = new Lexer(command);
    let t = l.makeTokens();
    let p = new Parser(t);
    let ast = p.parse();

    console.log(ast);
}