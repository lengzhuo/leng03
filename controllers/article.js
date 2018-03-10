const ArticleModel = require('../models/article');
const CategoryModel = require('../models/category');
const moment = require('moment');
const Article = {
    /**
     * 列表
     */
    index:(req, res, next)=>{

        //搜索关键字
        let key = req.query.key;
        //初始化正则
        let regex = new RegExp(key);
        //精选文章
        let is_jing = req.query.is_jing;

        //分页
        let count = 0;
        let limit = 3;
        let page = req.query.page;
        let totalPage = 0;
        let where = {};
        //对where对象赋值为正则regex
        if(key){
            //模糊查询 --{$regex:regex}
            where .title = {$regex:regex};
        }
        if (is_jing){
            where.is_jing = 1
        }
        //获取总条数
        ArticleModel.find(where).count().then(doc=>{
            count = doc;
            //计算分页
            totalPage = Math.ceil(count/limit);
            //console.log(key);
            ArticleModel.find(where).skip((page-1)*limit).limit(limit).sort({create_at:'desc'}).then(doc=>{
                //console.log(doc);
                let list = doc;
                let newList = [];
                for (let i=0;i<list.length;i++){
                    let article = list[i];
                    article = article.toJSON();
                    article.f_create_at = moment(article.create_at).format("YYYY-MM-DD");
                    newList.push(article);
                }
                res.json({
                    status:1,
                    result:newList,
                    page:page,
                    totalPage:totalPage
                });
            }).catch(err=>{
                console.log(err);
                res.json({
                    status:0,
                    msg:"获取失败"
                });
            });
        });
    },

    /**
     * 获取文章详情
     */
    get:(req, res, next)=>{

    },
    /**
     * 展示发布文章页面
     */
    add:(req, res, next) =>{
        let user = req.session.loginUser;
        CategoryModel.find({is_sys:0}).then(doc=>{
            res.render('add', {
                category:doc,
                user:user
            });
        })
    },
    /**
     * 保存
     */
    save:(req, res, next)=>{
        console.log(req.file);
         let articleModel = new ArticleModel({
            title:req.body.title,
            content:req.body.content,
            author:req.body.author,
            is_jing:req.body.is_jing,
            status:req.body.status,
            img:req.file.filename,
            category_id:req.body.category_id,
            //user_id:req.body.category_id,
         });
        articleModel.save();
        res.redirect('/');
    },
    /**
     * 更新
     */
    update:(req, res, next)=>{
        let id = req.params.id;
        ArticleModel.update({_id:id},{
            title:req.body.title,
            content:req.body.content,
            author:req.body.author,
            is_jing:req.body.is_jing,
            status:req.body.status,
            img:''
        }).then(doc=>{
            res.json(doc);
        })
    },
    /**
     * 删除
     */
    del:(req, res, next)=>{
        let id = req.params.id;
        ArticleModel.remove({_id:id}).then(doc=>{
            console.log(doc);
            res.json({
                status:1,
                msg:"删除成功"
            });
        }).catch(err=>{
            console.log(err);
            res.json({
                status:0,
                msg:"删除失败"
            });
        });
    }
}
module.exports = Article;