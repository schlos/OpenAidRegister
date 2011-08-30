class DashboardController < ApplicationController
  def show
       
        if session[:organization]
        else
           redirect_to :action => :login
        end
          
      sql="SELECT * FROM projects INNER JOIN organizations ON organizations.cartodb_id = projects.organization_guid"
      result = CartoDB::Connection.query(sql)
         
       #@fake_project_1 ={:name => 'first project from this organization', :ID =>'orgID1', :url => 'www.foo2.com'}
       #@fake_project_2 ={:name => 'second project from this organization', :ID =>'orgID2', :url => 'www.foo2.com'}
       #@fake_project_list = [@fake_project_1, @fake_project_2]
       @projects_list = result.rows
       @fake_current_projects = 2
       @fake_past_projects = 3
        @fake_total_projects = @fake_current_projects + @fake_past_projects
       @fake_sector_distribution = [12, 0, 0, 0, 0, 0, 84, 4] 
  end
  
  def import_file
 
  end
  
   def download
    
      sql="SELECT * FROM projects INNER JOIN organizations ON organizations.cartodb_id = projects.organization_guid"
      result = CartoDB::Connection.query(sql)
      
      # download_projects is an array which may contain 0 or more projects
      @download_projects = result.rows
     render :template => '/dashboard/download.xml.erb'
   end
   
   def delete
 
    # params[:project_check].each do |i|
    # if params[:project_check][i] == 1
    # project_id = @projects_list[i].cartodb_id 
    project_id = params[:delete_project_id]
    
      sql="delete * FROM projects where projects.cartodb_id = 'project_id'"
      result = CartoDB::Connection.query(sql)
      redirect_to  '/dashboard'
 end
end
