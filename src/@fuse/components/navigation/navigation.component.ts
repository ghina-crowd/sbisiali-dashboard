import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';


import {FuseNavigationService} from '@fuse/components/navigation/navigation.service';
import {navigation} from "../../../app/navigation/navigation";
import {AppService} from "../../../app/app.service";
import {Router} from "@angular/router";

@Component({
    selector: 'fuse-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit {
    @Input()
    layout = 'vertical';

    @Input()
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(private appService: AppService,
                private router: Router,
                private _changeDetectorRef: ChangeDetectorRef,
                private _fuseNavigationService: FuseNavigationService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        var decoded = jwt_decode(localStorage.getItem('auth_sbisiali_admin'));
        if (decoded) {
                this.navigation = navigation;

            }  else {
                this.router.navigateByUrl('/login');
                // localStorage.setItem('' , )
            }


        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }
}
