;
$(document).ready(function() {
			snow();
function snow() {
      //  1、定义一片雪花模板
      var flake = document.createElement('div');
      // 雪花字符 ❄❉❅❆✻✼❇❈❊✥✺
      flake.innerHTML = '❤';
      flake.style.cssText = 'position:absolute;color:deeppink';
 
      //获取页面的高度 相当于雪花下落结束时Y轴的位置
      var documentHieght = window.innerHeight;
      //获取页面的宽度，利用这个数来算出，雪花开始时left的值
      var documentWidth = window.innerWidth;
 
      //定义生成一片雪花的毫秒数
      var millisec = 100;
      //2、设置第一个定时器，周期性定时器，每隔一段时间（millisec）生成一片雪花；
      setInterval(function() { //页面加载之后，定时器就开始工作
        //随机生成雪花下落 开始 时left的值，相当于开始时X轴的位置
        var startLeft = Math.random() * documentWidth;
 
        //随机生成雪花下落 结束 时left的值，相当于结束时X轴的位置
        var endLeft = Math.random() * documentWidth;
 
        //随机生成雪花大小
        var flakeSize = 30 + 20 * Math.random();
 
        //随机生成雪花下落持续时间
        var durationTime = 4000 + 7000 * Math.random();
 
        //随机生成雪花下落 开始 时的透明度
        var startOpacity = 0.7 + 0.3 * Math.random();
 
        //随机生成雪花下落 结束 时的透明度
        var endOpacity = 0.2 + 0.2 * Math.random();
 
        //克隆一个雪花模板
        var cloneFlake = flake.cloneNode(true);
 
        //第一次修改样式，定义克隆出来的雪花的样式
        cloneFlake.style.cssText += `
            left: ${startLeft}px;
            opacity: ${startOpacity};
            font-size:${flakeSize}px;
            top:-25px;
               transition:${durationTime}ms;
           `;
 
        //拼接到页面中
        document.body.appendChild(cloneFlake);
 
        //设置第二个定时器，一次性定时器，
        //当第一个定时器生成雪花，并在页面上渲染出来后，修改雪花的样式，让雪花动起来；
        setTimeout(function() {
          //第二次修改样式
          cloneFlake.style.cssText += `
                left: ${endLeft}px;
                top:${documentHieght}px;
                opacity:${endOpacity};
              `;
 
          //4、设置第三个定时器，当雪花落下后，删除雪花。
          setTimeout(function() {
            cloneFlake.remove();
          }, durationTime);
        }, 0);
 
      }, millisec);
    }
    snow();
//			function snow() {
//				var flake = $("<div></div>");
//				flake.html("❤");
//				flake.css({
//					'position': 'absolute',
//					'color': 'pink'
//				});
//
//				var documentHieght = window.innerHeight;
//				var documentWidth = window.innerWidth;
//
//				var millisec = 10;
//				setInterval(function() {
//							var startLeft = Math.random() * documentWidth;
//							var endLeft = Math.random() * documentWidth;
//							var flakeSize = 5 + 20 * Math.random();
//							var durationTime = 4000 + 7000 * Math.random();
//							var startOpacity = 0.7 + 0.3 * Math.random();
//							var endOpacity = 0.2 + 0.2 * Math.random();
//
//							var cloneFlake = flake.clone(true);
//							//js代码混用
//							cloneFlake.style.css({
//								'left': '${startLeft}px',
//								'opacity': '${startOpacity}',
//								'font-size': '${flakeSize}px',
//								'top': '-25px',
//								'transition': '${durationTime}ms'
//							});
//
//							
//			document.body.appendChild(cloneFlake);
//
//			setTimeout(function() {
//				cloneFlake.css(
//              {'left': '${endLeft}px',
//              'top':'${documentHieght}px',
//             'opacity':'${endOpacity'})
//
//				setTimeout(function() {
//					cloneFlake.remove();
//				}, durationTime);
//			}, 0);
//
//		}, millisec);
//	}
(function() {
	'use strict';
	//store.clear();

	//变量声明
	var $form_add_task = $('.add-task'),
		$input = $("input"),
		task_list = [],
		$delete_task, //这边只声明下 因为你添加是动态的 要等加完了才可以找得到这个东西
		$details_task, //这两颗是键
		$detail = $(".task-detail"),
		current_index,
		$update_form,
		$checkbox_complete,
		$Iknow = $(".know"),
		$lb = $(".lb"),
		$line = $(".red_line"),
		$bgmusic = $(".bgmusic"),
		lb_flag = false,
		$messagemusic = $(".messagegmusic"),
		$delmsg = $(".del");

	init();

	//初始化  1.任务列表获取 2.将其任务渲染到页面上  3.监听喇叭按钮 4.监听任务添加
	function init() {
		task_list = store.get('task_list') || [];
		if(task_list.length) //如果task_list里本来就有东西的话 就去渲染一下
			render_task_list();

		listen_add_task()
		listen_lb();
	}

	/************/

	//任务添加监听器
	function listen_add_task() {
		$form_add_task.on('submit', function(e) {
			var new_task = {}; //这个要放在里面写 否则所有对象的content都变为一样的了
			e.preventDefault();
			new_task.content = $(this).find('input[name = content]').val(); //查找后代中的input[name=content]
			if(!new_task.content) return;
			if(add_task(new_task)) { //task_list push进去，store里面换成最新的task_list
				$input.val(null);
			}
		})
	}

	//任务添加函数
	function add_task(new_task) {
		task_list.push(new_task);
		update_task_list();
		return true;
	}

	/************/

	//喇叭按钮监听器 
	function listen_lb() {
		function mc() {
			if(lb_flag) {
				$bgmusic.get(0).pause(); //背景音乐暂停
				$(".red_line").css("display", "block");
				lb_flag = false;
			} else {
				$bgmusic.get(0).play();
				lb_flag = true;
				$(".red_line").css("display", "none");
			}
		}
		$lb.on("click", mc);
		$line.on("click", mc);
	}

	/************/

	//消息提示监听器   实时监控时间（设立定时器）
	function listen_msg() {
		var current_time;
		var task_time;
		var time = setInterval(function() {
				for(var k = 0; k < task_list.length; k++) {
					var item = store.get('task_list')[k];
					if(!item || !item.remind) continue;
					current_time = (new Date()).getTime();
					task_time = (new Date(item.remind)).getTime();
					if(current_time - task_time >= 0 && current_time - task_time <= 2000 && !item.inform) {
						msg_notify(item.content);
						$messagemusic.get(0).play();
						update_detail(k, {
							inform: true
						});
					}
				}
			},
			1000);
	}
	//消息框下拉
	function msg_notify(content) {
		$(".msg_content").html(content);
		$(".msg").slideDown(500);
	}
	//消息框上卷
	function msg_hide() {
		$Iknow.on("click", function() {
			$(".msg").slideUp(500);
		})
	}

	/************/

	//任务删除监听器
	function listen_task_delete() {
		$delete_task.on('click', function() {
			var $this = $(this);
			var $item = $this.parent();
			var index = $item.data('index');
			$delmsg.css('display', 'block');

			//删除任务确认
			$(".yes").on('click', function() {
				console.log(1);
				delete_task(index);
				$delmsg.css('display', 'none');
			})
			$(".no").on('click', function() {
				$delmsg.css('display', 'none');
			})
		})
	}

	//删除任务函数
	function delete_task(index) {
		if(index === undefined || !task_list[index]) return; //无index 或者index不存在
		delete task_list[index];
		update_task_list();
	}
	//任务详情监听器
	function listen_task_details() {
		$details_task.on('click', function() {
			var $this = $(this);
			var $item = $this.parent();
			var index = $item.data('index');
			task_details(index);
		})
	}
	//任务详情函数    需调用任务模板
	function task_details(index) {
		if(index === undefined || !task_list[index]) return;
		$detail.show();
		$(".op").show();
		$(".op").on("click", function() {
			$detail.hide();
			$(".op").hide();
		})
		current_index = index;
		render_detail_tpl(index);
	}

	//任务checked监听器
	function listen_checkbox_complete() {
		$checkbox_complete.on('click', function() {
			var $this = $(this);
			var index = $this.parent().parent().data('index');
			var item = store.get('task_list')[index];
			if(!item.complete) {
				update_detail(index, {
					complete: true,
					inform: true
				});
			} else {
				update_detail(index, {
					complete: false
				});
			}
		})
	}

	/************/

	//修改任务数据项    调用  localstorage更新函数  内部属性修改时要被调用
	function update_detail(index, data) {
		if(index === undefined || !task_list[index]) return;
		task_list[index] = $.extend({}, task_list[index], data); //原来的数据也要保留下   //extend用于对象  merge用于数组
		update_task_list();
	}

	/************/

	//更新localstorage 并渲染模板          任务添加   任务删除    数据项修改时  要被调用   调用页面渲染
	function update_task_list() {
		store.set("task_list", task_list);
		render_task_list();
	}

	//页面渲染  (和已存在任务相关的操作都要在这监听)   1.监听任务删除  2.监听任务详情   3.监听任务checked 4.监听消息弹框
	function render_task_list() {
		var $task_list = $(".task-list");
		$task_list.html('');
		var complete_arr = [];
		for(var i = 0; i < task_list.length; i++) {
			var item = task_list[i]
			if(item && item.complete) {
				complete_arr[i] = item; //做到index不管是放到complete_arr里的还是task_list的都表示统一
			} else {
				var $task = render_task_tpl(task_list[i], i);
				$task_list.prepend($task); //往页面中加一个个模板
			}
		}
		//已完成事件  
		for(var j = 0; j < complete_arr.length; j++) {
			if(!complete_arr[j]) continue;
			var $task = render_task_tpl(complete_arr[j], j);
			$task.addClass('checked');
			$task_list.append($task);
		}

		$delete_task = $('.action-delete'); //每次渲染的时候会把index加进去
		listen_task_delete();

		$details_task = $('.action-details');
		listen_task_details();

		$checkbox_complete = $(".complete");
		listen_checkbox_complete();

		listen_msg();
	}
	//任务列表模板 
	function render_task_tpl(data, index) {
		if(index === undefined || !data) return;
		var list_item_tpl =
			' <div class="task-item" data-index="' + index + '">' +
			'<span><input type="checkbox"' + (data.complete ? 'checked' : '') + ' class="complete"></span>' +
			'<span class="task-content">&nbsp;&nbsp;' + data.content + '</span>' +
			'<span class="action-details">详细&nbsp;</span>' +
			'<span class="action-delete">刪除&nbsp;&nbsp;</span>' +
			'</div>';
		return $(list_item_tpl);
	}
	//任务细节模板   数据更新 
	function render_detail_tpl(index) {
		if(index === undefined || !task_list[index]) return;
		var item = task_list[index];
		var detail_tpl =
			'<form>' +
			'<input class="content" name="content" value="' + item.content + '"autocomplete="off"	>' +
			'<div class="desc">' +
			'<textarea name="desc">' + (item.desc || "") + '</textarea>' +
			'</div>' +
			'<div class="remind">' +
			'<label>提醒时间:</label>' +
			'<input  class="datetime" name="remind" type="text" autocomplete="off" value="' + (item.remind || '') + '">' +
			'<button type="submit">更新</button>' +
			'</div>' +
			'</form>';
		$detail.html(detail_tpl);
		$update_form = $detail.find('form');
		$(".datetime").datetimepicker();

		$update_form.on("submit", function(e) {
			e.preventDefault();
			var data = {};
			data.content = $(this).find('[name=content]').val();
			data.desc = $(this).find('[name=desc]').val();
			data.remind = $(this).find('[name=remind]').val();
			update_detail(index, data);

			$detail.hide();
			$(".op").hide();
		})
	}
})();
})