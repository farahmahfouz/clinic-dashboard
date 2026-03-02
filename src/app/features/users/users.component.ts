import { Component, OnInit } from '@angular/core';
import { TableComponent } from "../../shared/components/table/table.component";
import { UsersService } from '../../core/services/users.service';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';
import { OperationIconComponent } from '../../shared/icons/operation-icon.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableComponent, AsyncPipe, DatePipe, OperationIconComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  users$!: Observable<any[]>;

  selectedRole: string = 'all';
  selectedSort: string = '-createdAt';
  searchValue = '';

  columns = [
    { label: 'Name', field: 'name' },
    { label: 'Role', field: 'role' },
    { label: 'Email', field: 'email' },
    { label: 'Phone', field: 'phone' },
    { label: 'Created', field: 'createdAt' },
  ];

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.users$ = this.userService.users$;
    this.route.queryParams.subscribe(params => {

      this.selectedRole = params['role'] || 'all';
      this.selectedSort = params['sort'] || '-createdAt';
      this.searchValue = params['search'] || '';

      return this.userService.getAllUsers(
        this.selectedRole,
        this.selectedSort,
        this.searchValue
      ).subscribe();
    }

    );
  }

  filterByRole(role: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { role },
      queryParamsHandling: 'merge'
    });
  }

  sortUsers(sort: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort },
      queryParamsHandling: 'merge'
    });
  }

  searchUsers(search: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search },
      queryParamsHandling: 'merge'
    });
  }
}
