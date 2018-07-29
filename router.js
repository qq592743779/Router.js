class Router {
    constructor(type){
        //  储存hash与callback键值对
        this.routes = {}; 
        //  判断模式类型
        if(type === 'history'){
            // 在初始化时监听popstate事件
            this._bindPopState();
        }else if(type === 'hash'){
            //  当前hash
            this.currentUrl = '';
            //  记录出现过的history
            this.history = [];
            //  当前history的指针
            this.currentHistoryIndex = this.history.length - 1;
            // 默认不是后退操作
            this.isBack = false;

            this.backOff = this.backOff.bind(this);
            this.refresh = this.refresh.bind(this);
            window.addEventListener('load', this.refresh);
            window.addEventListener('hashchange', this.refresh);
        }
    }
    //  将path路径与对应路径的callback函数存储
    route(path, callback){
        this.routes[path] = callback || function() {};
    }
    

    /**
     * =========================================================
     * hash模式使用到的函数
     * =========================================================
     */

    //  刷新
    refresh(){
        //  获取当前URL的hash路径
        this.currentUrl = location.hash.slice(1) || '/';
        if(!this.isBack){
            if (this.currentHistoryIndex < this.history.length - 1){
                this.history = this.history.slice(0, this.currentHistoryIndex + 1);
            }
            //  把当前hash放入history栈堆里
            this.history.push(this.currentUrl);
            //  指针向前移动
            this.currentHistoryIndex++;
        }
        //  执行当前hash路径的callback函数
        this.routes[this.currentUrl] && this.routes[this.currentUrl]();
        this.isBack = false;
        console.log('指针:', this.currentHistoryIndex, 'history:', this.history);
    }
    //  后退功能
    backOff(){
        this.isBack = true;
        this.currentHistoryIndex <= 0 
        ? (this.currentHistoryIndex = 0) 
        : (this.currentHistoryIndex = this.currentHistoryIndex - 1);
        location.hash = `#${this.history[this.currentHistoryIndex]}`;
    }

    /**
     * =========================================================
     * history莫斯使用到的函数
     * =========================================================
     */

    // 初始化路由
    init(path) {
        history.replaceState({path: path}, null, path);
        this.routes[path] && this.routes[path]();
    }
    //  触发路由对应的回调
    go(path){
        history.pushState({path:path}, null, path);
        this.routes[path] && this.routes[path]();
    }
    //  监听popstate事件
    _bindPopState(){
        window.addEventListener('popstate', e => {
            const path = e.state && e.state.path;
            this.routes[path] && this.routes[path]();
        })
    }
}
