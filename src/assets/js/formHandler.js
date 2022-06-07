export class FormValidator {


    constructor(prop_element = null, prop_currentStepIdx = 0) {
        this.element = prop_element
        this.steps = [...this.element.querySelectorAll('.js-step')]
        this.formControls = [...this.element.querySelectorAll('.js-form-control')]
        this.btnPrev = this.element.querySelector('.imui_js_prev')
        this.btnNext = this.element.querySelector('.imui_js_next')
        this.progressBar = this.element.querySelector('.animation__bar')
        this.rangeSliders = [...this.element.querySelectorAll('.imuirangeslider__range')]
        this.formSelector =  document.getElementById('form_imui_1')
        this.answerWrap =  this.element.querySelector('#imui_answers')
        this.stepMainHeading = this.element.querySelector('#step_main__heading ') 
        this.stepMainInfoName = this.element.querySelector('#step_main__bar .name') 
        this.stepMainInfoDesc = this.element.querySelector('#step_main__bar .desc') 
        
        
        this.currentStepIdx = prop_currentStepIdx
        this.formStaticLables = {
            step_0_Bar_Name : 'STEP 1',
            step_0_Bar_Desc :  'Sign Up',
            step_0_Bar_Heading :  'Sign up to begin your <br> journey with us',
            step_1_Bar_Name :  'STEP 2',
            step_1_Bar_Desc :  'Tell us about yourself',
            step_1_Bar_Heading :  'Tell us about yourself <br> and your coding experience ',
            step_2_Bar_Name :  'STEP 3',
            step_2_Bar_Desc :  'Skills',
            step_2_Bar_Heading :  'Describe your current <br> programming skill set ',
            step_3_Bar_Name :  'STEP 4',
            step_3_Bar_Desc:  'Review',
            step_4_Bar_Name :  'STEP 5',
            step_4_Bar_Desc:  'Completed',
            formFieldLables : {
               firstname : 'First name',
               lastname : 'Last name',
               github_url : 'Github URL',
               email : 'Email',
               country : 'Country',
               webdevelopment : 'How did you get started with web development? ',
               scrumteam : 'What do you enjoy about working on a Scrum team? ',
               technicaltrends : 'What technical trends are you most interested in?',
               javascript : 'Javascript',
               css : 'Cascading Stylesheets (CSS) & Sass/SCSS',
               jquery : 'jQuery',
           }
        }
        this.init()
    }

    init() {
        this.showStep(this.currentStepIdx)
        this.addEvents()
        this.setRangePopup()
    }

    showStep(prop_stepIdx = 0) {
        const stepIdx = prop_stepIdx
        this.steps[stepIdx].classList.add('is-active')
        this.btnPrev.classList[stepIdx === 0 ? 'remove' : 'add']('is-active')
        this.btnPrev.classList[stepIdx === 0 ? 'add' : 'remove']('disabled')
        this.btnNext.innerText = this.btnNext.dataset[stepIdx === this.steps.length - 1 ? 'finalStepText' : 'stepText']

        this.updateProgressBar(stepIdx)
        this.updateStepsInfo(stepIdx)
    }

    prevNext(prop_value = 0) {
        const value = prop_value

        if (value === 1 && !this.validate()) {
            return false
        }

        this.steps[this.currentStepIdx].classList.remove('is-active')
        this.currentStepIdx += value


        if(this.currentStepIdx === 3){
            this.handleSubmit()
        }

        if (this.currentStepIdx >= this.steps.length) {
            this.updateToBarText(this.currentStepIdx)
            this.renderSucessMessage()
            return false
        }

        this.showStep(this.currentStepIdx)
    }

    validate() {
        const currentStepRequiredElements = [...this.steps[this.currentStepIdx].querySelectorAll('[required]')]
        let valid = true

        for (let element of currentStepRequiredElements) {


            if (element.value === null || element.value.trim() === '') {
                    element.closest('.js-input-group').classList.add('has-error')
                    valid = false
            }

            if(element.dataset.validation === 'email'){
                if(!this.emailValidator(element.value) ){
                    element.closest('.js-input-group').classList.add('has-error')
                    valid = false
                }
            }

            if(element.dataset.validation === 'checkbox'){
                if(!this.checkBoxValidator(element) ){
                    element.closest('.js-input-group').classList.add('has-error')
                    valid = false
                }
            }

            if(element.dataset.validation === 'url'){
                if(!this.urlValidator(element.value) ){
                    element.closest('.js-input-group').classList.add('has-error')
                    valid = false
                }
            }

            
        }

        return valid
    }


    checkBoxValidator(checkbox) {
        return checkbox.checked == true ? true : false;
    }

    emailValidator(email) {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }


    clearErrors(e) {
        e.target.closest('.js-input-group').classList.remove('has-error')
    }

    urlValidator(url){
        let urlPattern = new RegExp('^(https?:\\/\\/)?'+ 
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
            '(\\#[-a-z\\d_]*)?$','i');
        return !!urlPattern.test(url);
    }

    updateProgressBar(prop_stepIdx = 0) {
        const percentage = prop_stepIdx * 25 + 25;
        this.progressBar.style.width = `${percentage === 0 ? '25' : percentage}%`
    }


    setRangePopup() {
        for (let range of this.rangeSliders) {
            this.setRangeValue(range)
        }
    }

    addRangeEvents(){
        for (let range of this.rangeSliders) {
           // range.addEventListener('change', this.setRangeValue.bind(this))
        }
    }

    setRangeValue(range) {
        const newValue = Number( (range.value - range.min) * 100 / (range.max - range.min) )
        let databubbleValue = range.dataset.bubble;
        const newPosition = 10 - (newValue * 20);
        let rangeBubbleSelector = `rangeslider_${databubbleValue} `;
        this.createBubble(range.value , newValue , newPosition , rangeBubbleSelector );
    }

    createBubble(rangeValue, newValue, newPosition , rangeBubbleSelector ){
        let rangeBubblePopUP = document.querySelector(`.${rangeBubbleSelector}`);        
        rangeBubblePopUP.innerHTML = `<span>${rangeValue}</span>`;
        rangeBubblePopUP.style.left = `calc(${newValue}% + (${newPosition}px))`;
    }

    addEvents() {
        for (let formControl of this.formControls) {
            formControl.addEventListener('keyup', this.clearErrors.bind(this))
            formControl.addEventListener('change', this.clearErrors.bind(this))
        }

        this.btnPrev.addEventListener('click', this.prevNext.bind(this, -1))
        this.btnNext.addEventListener('click', this.prevNext.bind(this, 1))
    }


    handleSubmit(event) {
        const formData = new FormData( this.formSelector );
        this.stepMainHeading.innerHTML = `Thank you ${ formData.get('firstname') }! <br> Please review your answers`
        let userAnswers = `<ul>`
        for (var formSubmittedVal of formData.entries()) {
            if( this.formStaticLables.formFieldLables.hasOwnProperty( formSubmittedVal[0] ) ){
                let formNameKey = formSubmittedVal[0];
                userAnswers += `<li><span>${ this.formStaticLables.formFieldLables[formNameKey] }</span>${formSubmittedVal[1]}</li>`
            } 
        }
        userAnswers += `</ul>`
        this.answerWrap.innerHTML = userAnswers
       // console.log({ userAnswers });
    }


    renderSucessMessage(){
        const formStepsWrap =  document.getElementById('imui-form__steps')
        const formSucessWrap =  document.getElementById('imui-form-sucess-wrap')
        const formStepsPagination =  document.querySelector('.imui-form__footer')
        const formSucessBar =  document.querySelector('.animation__bar')
        formSucessBar.classList.add("sucess");
        formStepsWrap.style.display = 'none'
        formStepsPagination.style.display = 'none'
        formSucessWrap.classList.remove("hide");
    }


    updateStepsInfo(prop_stepIdx = 0){

        if(prop_stepIdx < 3){
            this.stepMainHeading.innerHTML = this.formStaticLables[`step_${prop_stepIdx}_Bar_Heading`]
        }
        if(prop_stepIdx < 4){
            this.updateToBarText(prop_stepIdx)
            const stepMainImages = document.querySelectorAll(`#step_main__image .imui_step_image`)        
            for (let stepMainImage of stepMainImages) {
                if (stepMainImage.classList.contains(`imui_step_${prop_stepIdx}_image`)) {
                    stepMainImage.classList.remove("hide")
                }
                else{
                    stepMainImage.classList.add("hide")
                }   
            }
        }
    }

    updateToBarText(prop_stepIdx = 0){
       // console.log(this.formStaticLables[`step_${prop_stepIdx}_Bar_Name`])
        this.stepMainInfoName.innerText = this.formStaticLables[`step_${prop_stepIdx}_Bar_Name`]
        this.stepMainInfoDesc.innerText = this.formStaticLables[`step_${prop_stepIdx}_Bar_Desc`]
    }

    
}

window.addEventListener('load', () => {
    window.formImuiObjs = {}
    const formImuis = [...document.querySelectorAll('.js-form-imui')]
    if (formImuis.length) {
        for (let formImui of formImuis) {
            formImuiObjs[formImui.id] = new FormValidator(formImui)
        }
    }
})